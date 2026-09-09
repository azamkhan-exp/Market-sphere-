import { db } from "@/lib/db";
import { isDatabaseEnabled } from "@/lib/config";
import { OrderRepository } from "@/repositories";
import { generateOrderNumber } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/currency";
import { InventoryService } from "./inventoryService";
import { EmailService } from "@/lib/email";
import { validateOrderTransition, canTransitionOrder } from "@/lib/orderStateMachine";

export interface CreateOrderParams {
  userId: string;
  cartId: string;
  shippingAddress: any;
  billingAddress?: any;
  shippingMethod: "STANDARD" | "EXPRESS" | "OVERNIGHT";
  couponCode?: string;
  isGift?: boolean;
  giftMessage?: string;
  paymentIntentId: string;
}

export class OrderService {
  static async createOrder(params: CreateOrderParams) {
    const cart = await db.cart.findUnique({
      where: { id: params.cartId },
      include: {
        items: {
          include: {
            product: { include: { seller: true } },
            variant: true,
          },
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty or not found");
    }

    // 1. Recalculate totals server-side
    let subtotal = 0;
    for (const item of cart.items) {
      const price = item.variant?.price ?? item.product?.salePrice ?? item.product?.basePrice ?? 100;
      subtotal += price * item.quantity;
    }

    let discountValue = 0;
    let discountType: "PERCENTAGE" | "FIXED" | undefined;
    let couponId: string | undefined;

    if (params.couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: params.couponCode.toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        discountValue = coupon.discountValue;
        discountType = coupon.discountType as "PERCENTAGE" | "FIXED";
        couponId = coupon.id;
      }
    }

    const totals = calculateOrderTotals({
      subtotal,
      discountValue,
      discountType,
      shippingMethod: params.shippingMethod,
    });

    // If Database-Off mode, create order via OrderRepository
    if (!isDatabaseEnabled()) {
      const items = cart.items.map((i: any) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        unitPrice: i.unitPrice || (i.product?.salePrice ?? i.product?.basePrice ?? 100),
        title: i.product?.title || "Marketplace Product",
      }));

      const demoOrder = await OrderRepository.create({
        userId: params.userId,
        items,
        shippingAddress: params.shippingAddress,
        billingAddress: params.billingAddress,
        shippingMethod: params.shippingMethod,
        shippingCost: totals.shippingFee,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        totalAmount: totals.total,
        couponCode: params.couponCode,
        isGift: params.isGift,
        giftMessage: params.giftMessage,
        paymentMethod: "DEMO_PAYMENT",
        paymentIntentId: params.paymentIntentId,
      });

      return demoOrder;
    }

    // 2. Atomic Database Order Creation
    const orderNumber = generateOrderNumber();
    const order = await db.$transaction(async (tx: any) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: params.userId,
          status: "CONFIRMED",
          paymentStatus: "PAID",
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          shippingFee: totals.shippingFee,
          taxAmount: totals.taxAmount,
          totalAmount: totals.total,
          couponCode: params.couponCode,
          shippingAddressJson: JSON.stringify(params.shippingAddress),
          billingAddressJson: JSON.stringify(params.billingAddress || params.shippingAddress),
          shippingMethod: params.shippingMethod,
          isGift: params.isGift || false,
          giftMessage: params.giftMessage,
          trackingNumber: `MS-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
          carrier: "MarketSphere Express",
          estimatedDelivery: new Date(Date.now() + 86400000 * 3),
        },
      });

      // Create OrderItems
      for (const item of cart.items) {
        const unitPrice = item.variant?.price ?? item.product.salePrice ?? item.product.basePrice;
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            sellerId: item.product.sellerId,
            productId: item.productId,
            variantId: item.variantId,
            title: item.product.title,
            sku: item.variant?.sku ?? item.product.sku,
            unitPrice,
            quantity: item.quantity,
            subtotal: unitPrice * item.quantity,
            sellerStatus: "PROCESSING",
          },
        });
      }

      // Record Payment
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          paymentProvider: "STRIPE",
          providerPaymentId: params.paymentIntentId,
          amount: totals.total,
          currency: "USD",
          status: "SUCCEEDED",
        },
      });

      // Update coupon usage if applicable
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { timesUsed: { increment: 1 } },
        });

        await tx.couponUsage.create({
          data: {
            couponId,
            userId: params.userId,
            orderId: createdOrder.id,
            discountAmount: totals.discountAmount,
          },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: params.cartId } });
      await tx.cart.update({
        where: { id: params.cartId },
        data: { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0, couponCode: null },
      });

      return createdOrder;
    });

    // 3. Deduct inventory safely
    await InventoryService.deductInventory(
      cart.items.map((i: any) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      order.id
    );

    // 4. Send Confirmation Email asynchronously
    EmailService.sendOrderConfirmation({
      to: params.shippingAddress.email || "customer@example.com",
      orderNumber: order.orderNumber,
      customerName: params.shippingAddress.fullName,
      items: cart.items.map((i: any) => ({
        title: i.product.title,
        quantity: i.quantity,
        price: i.variant?.price ?? i.product.salePrice ?? i.product.basePrice,
      })),
      subtotal: totals.subtotal,
      shipping: totals.shippingFee,
      tax: totals.taxAmount,
      discount: totals.discountAmount,
      total: totals.total,
      shippingAddress: params.shippingAddress,
      estimatedDelivery: "3-5 business days",
    }).catch(console.error);

    return order;
  }

  static async getOrderById(orderId: string) {
    if (!isDatabaseEnabled()) {
      return OrderRepository.findById(orderId);
    }

    return db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
            seller: true,
          },
        },
        shipments: true,
        payments: true,
      },
    });
  }

  static async getUserOrders(userId: string) {
    if (!isDatabaseEnabled()) {
      return OrderRepository.findByUserId(userId);
    }

    return db.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
          },
        },
        shipments: true,
      },
    });
  }

  static async getSellerOrders(sellerId: string) {
    if (!isDatabaseEnabled()) {
      return OrderRepository.findBySellerId(sellerId);
    }

    return db.orderItem.findMany({
      where: { sellerId },
      include: {
        order: {
          include: {
            shipments: true,
          },
        },
        product: {
          include: { images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async cancelOrder(orderId: string, userId: string, reason: string) {
    if (!isDatabaseEnabled()) {
      return OrderRepository.updateStatus(orderId, "CANCELLED");
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    if (order.customerId !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    validateOrderTransition(order.status, "CANCELLED");

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        paymentStatus: "REFUNDED",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    await InventoryService.restoreInventory(
      order.items.map((i: any) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      orderId,
      reason
    );

    return updatedOrder;
  }

  static async updateOrderStatus(
    orderId: string,
    nextStatus: string,
    details?: { trackingNumber?: string; carrier?: string }
  ) {
    if (!isDatabaseEnabled()) {
      return OrderRepository.updateStatus(orderId, nextStatus as any, details?.trackingNumber, details?.carrier);
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    validateOrderTransition(order.status, nextStatus);

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        trackingNumber: details?.trackingNumber || order.trackingNumber,
        carrier: details?.carrier || order.carrier,
        ...(nextStatus === "DELIVERED" ? { estimatedDelivery: new Date() } : {}),
      },
    });

    await db.notification.create({
      data: {
        userId: order.customerId,
        role: "CUSTOMER",
        title: `Order Status: ${nextStatus}`,
        message: `Your order #${order.orderNumber} is now marked as ${nextStatus}.`,
        type: nextStatus === "SHIPPED" ? "SHIPPING" : "ORDER",
        link: `/orders/${order.id}/track`,
      },
    });

    return updated;
  }
}
