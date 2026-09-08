import { db } from "@/lib/db";

export interface StockItemParam {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export class InventoryService {
  /**
   * Calculates consistent available stock for a product or variant
   */
  static getAvailableStock(product: { stockQuantity: number; reservedQuantity: number }): number {
    return Math.max(0, product.stockQuantity - product.reservedQuantity);
  }

  /**
   * Atomically reserve stock during checkout initialization to prevent overselling race conditions
   */
  static async reserveStock(items: StockItemParam[], referenceId: string) {
    return db.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const available = product.stockQuantity - product.reservedQuantity;
        if (available < item.quantity) {
          throw new Error(
            `Insufficient available stock for "${product.title}". Requested: ${item.quantity}, Available: ${available}`
          );
        }

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant || variant.stockQuantity < item.quantity) {
            throw new Error(`Insufficient variant stock for ${variant?.name || item.variantId}`);
          }
        }

        // Increment reserved quantity
        await tx.product.update({
          where: { id: item.productId },
          data: { reservedQuantity: { increment: item.quantity } },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "RESERVATION",
            quantity: item.quantity,
            balanceAfter: product.stockQuantity - (product.reservedQuantity + item.quantity),
            referenceId,
            notes: `Reserved for checkout session ${referenceId}`,
          },
        });
      }
    });
  }

  /**
   * Release reserved stock when checkout is abandoned or expires
   */
  static async releaseStock(items: StockItemParam[], referenceId: string) {
    return db.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;

        const releaseQty = Math.min(item.quantity, product.reservedQuantity);
        if (releaseQty > 0) {
          await tx.product.update({
            where: { id: item.productId },
            data: { reservedQuantity: { decrement: releaseQty } },
          });

          await tx.inventoryTransaction.create({
            data: {
              productId: item.productId,
              type: "RELEASE",
              quantity: -releaseQty,
              balanceAfter: product.stockQuantity - (product.reservedQuantity - releaseQty),
              referenceId,
              notes: `Released reservation for ${referenceId}`,
            },
          });
        }
      }
    });
  }

  /**
   * Deduct inventory upon order confirmation using transactional safety
   */
  static async deductInventory(items: StockItemParam[], orderId: string) {
    return db.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.title}". Requested: ${item.quantity}, On-hand: ${product.stockQuantity}`
          );
        }

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant || variant.stockQuantity < item.quantity) {
            throw new Error(`Insufficient variant stock for ${variant?.name || item.variantId}`);
          }

          // Deduct variant stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }

        // Deduct master product stock and release any reservation
        const reservedToRelease = Math.min(item.quantity, product.reservedQuantity);
        const updatedProduct = await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            reservedQuantity: { decrement: reservedToRelease },
            totalSales: { increment: item.quantity },
            status: product.stockQuantity - item.quantity <= 0 ? "OUT_OF_STOCK" : product.status,
          },
        });

        // Record inventory transaction
        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "PURCHASE",
            quantity: -item.quantity,
            balanceAfter: updatedProduct.stockQuantity,
            referenceId: orderId,
            notes: `Purchased in Order #${orderId}`,
          },
        });
      }
    });
  }

  /**
   * Restore inventory upon valid order cancellation or refund
   */
  static async restoreInventory(items: StockItemParam[], orderId: string, reason: string) {
    return db.$transaction(async (tx) => {
      for (const item of items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }

        const product = await tx.product.findUnique({ where: { id: item.productId } });
        const newStock = (product?.stockQuantity || 0) + item.quantity;
        const shouldReactivate = product?.status === "OUT_OF_STOCK" && newStock > 0;

        const updatedProduct = await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
            totalSales: { decrement: Math.min(item.quantity, product?.totalSales || item.quantity) },
            status: shouldReactivate ? "ACTIVE" : undefined,
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "RETURN",
            quantity: item.quantity,
            balanceAfter: updatedProduct.stockQuantity,
            referenceId: orderId,
            notes: `Restored from cancelled/refunded order: ${reason}`,
          },
        });

        // If product was restocked from zero, trigger back-in-stock alerts!
        if (product && product.stockQuantity === 0 && updatedProduct.stockQuantity > 0) {
          await InventoryService.triggerBackInStockAlerts(item.productId, updatedProduct.title);
        }
      }
    });
  }

  /**
   * Notifies users who registered back-in-stock alerts for a product
   */
  static async triggerBackInStockAlerts(productId: string, productTitle: string) {
    try {
      const pendingAlerts = await db.stockAlert.findMany({
        where: { productId, isNotified: false },
        include: { user: true },
      });

      for (const alert of pendingAlerts) {
        await db.notification.create({
          data: {
            userId: alert.userId,
            role: "CUSTOMER",
            title: "Item Back in Stock!",
            message: `"${productTitle}" is now back in stock and ready to order.`,
            type: "BACK_IN_STOCK",
            link: `/products/${productId}`,
          },
        });

        await db.stockAlert.update({
          where: { id: alert.id },
          data: { isNotified: true },
        });
      }
    } catch (e) {
      console.error("Failed to process back-in-stock alerts:", e);
    }
  }

  /**
   * Records a price change and triggers price-drop alerts
   */
  static async recordPriceChange(
    productId: string,
    oldPrice: number,
    newPrice: number,
    changedBy?: string,
    sellerId?: string
  ) {
    if (oldPrice === newPrice) return;

    await db.priceHistory.create({
      data: {
        productId,
        oldPrice,
        newPrice,
        changedBy,
        sellerId,
      },
    });

    // If price dropped, check price alerts
    if (newPrice < oldPrice) {
      const product = await db.product.findUnique({ where: { id: productId }, select: { title: true, slug: true } });
      const triggeredAlerts = await db.priceAlert.findMany({
        where: {
          productId,
          isTriggered: false,
          targetPrice: { gte: newPrice },
        },
      });

      for (const alert of triggeredAlerts) {
        await db.notification.create({
          data: {
            userId: alert.userId,
            role: "CUSTOMER",
            title: "Price Drop Alert! 📉",
            message: `"${product?.title}" has dropped to $${newPrice.toFixed(2)} (your target was $${alert.targetPrice.toFixed(2)}).`,
            type: "PRICE_DROP",
            link: `/products/${product?.slug}`,
          },
        });

        await db.priceAlert.update({
          where: { id: alert.id },
          data: { isTriggered: true },
        });
      }
    }
  }
}
