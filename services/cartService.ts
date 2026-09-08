import { db } from "@/lib/db";
import { calculateOrderTotals } from "@/lib/currency";

export class CartService {
  static async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new Error("Either userId or sessionId must be provided");
    }

    let cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId,
          sessionId: userId ? undefined : sessionId,
        },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1 } },
              },
              variant: true,
            },
          },
        },
      });
    }

    return cart;
  }

  static async recalculateCart(cartId: string) {
    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true, variant: true },
        },
      },
    });

    if (!cart) return null;

    let subtotal = 0;
    for (const item of cart.items) {
      const price = item.variant?.price ?? item.product.salePrice ?? item.product.basePrice;
      subtotal += price * item.quantity;
    }

    // Check coupon
    let discountValue = 0;
    let discountType: "PERCENTAGE" | "FIXED" | undefined;

    if (cart.couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: cart.couponCode.toUpperCase() },
      });

      if (
        coupon &&
        coupon.isActive &&
        subtotal >= coupon.minOrderAmount &&
        (!coupon.endDate || new Date(coupon.endDate) > new Date()) &&
        coupon.timesUsed < coupon.usageLimit
      ) {
        discountValue = coupon.discountValue;
        discountType = coupon.discountType as "PERCENTAGE" | "FIXED";
      } else {
        // Invalidate coupon
        await db.cart.update({
          where: { id: cartId },
          data: { couponCode: null },
        });
      }
    }

    const totals = calculateOrderTotals({
      subtotal,
      discountValue,
      discountType,
      shippingMethod: "STANDARD",
    });

    return db.cart.update({
      where: { id: cartId },
      data: {
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        tax: totals.taxAmount,
        shipping: totals.shippingFee,
        total: totals.total,
      },
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
            variant: true,
          },
        },
      },
    });
  }

  static async addItem(cartId: string, productId: string, variantId?: string, quantity = 1) {
    // 1. Verify product & stock
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product || product.status !== "ACTIVE") {
      throw new Error("Product is unavailable or out of stock");
    }

    const availableStock = variantId
      ? product.variants.find((v) => v.id === variantId)?.stockQuantity ?? 0
      : product.stockQuantity;

    if (availableStock < quantity) {
      throw new Error(`Only ${availableStock} units available in stock`);
    }

    const unitPrice = variantId
      ? product.variants.find((v) => v.id === variantId)?.price ?? product.basePrice
      : product.salePrice ?? product.basePrice;

    // Check existing
    const existing = await db.cartItem.findFirst({
      where: { cartId, productId, variantId: variantId ?? null },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > availableStock) {
        throw new Error(`Cannot exceed available stock of ${availableStock}`);
      }
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId,
          productId,
          variantId: variantId ?? null,
          quantity,
          unitPrice,
        },
      });
    }

    return this.recalculateCart(cartId);
  }

  static async updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      const item = await db.cartItem.findUnique({ where: { id: itemId } });
      if (!item) return null;
      await db.cartItem.delete({ where: { id: itemId } });
      return this.recalculateCart(item.cartId);
    }

    const item = await db.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true, variant: true },
    });
    if (!item) throw new Error("Cart item not found");

    const maxStock = item.variant ? item.variant.stockQuantity : item.product.stockQuantity;
    if (quantity > maxStock) {
      throw new Error(`Maximum available quantity is ${maxStock}`);
    }

    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.recalculateCart(item.cartId);
  }

  static async removeItem(itemId: string) {
    const item = await db.cartItem.findUnique({ where: { id: itemId } });
    if (!item) return null;
    await db.cartItem.delete({ where: { id: itemId } });
    return this.recalculateCart(item.cartId);
  }

  static async applyCoupon(cartId: string, couponCode: string) {
    const code = couponCode.trim().toUpperCase();
    const coupon = await db.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid or inactive coupon code");
    }

    if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
      throw new Error("Coupon code has expired");
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      throw new Error("Coupon usage limit has been reached");
    }

    await db.cart.update({
      where: { id: cartId },
      data: { couponCode: code },
    });

    return this.recalculateCart(cartId);
  }
}
