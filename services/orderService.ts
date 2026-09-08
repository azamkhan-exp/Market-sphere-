import { db } from "@/lib/db";
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

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty or not found");
    }

    // 1. Recalculate totals server-side
    let subtotal = 0;
    for (const item of cart.items) {
      const price = item.variant?.price ?? item.product.salePrice ?? item.product.basePrice;
      subtotal += price * item.quantity;
    }

    let discountValue = 0;
    let discountType: "PERCENTAGE" | "FIXED" | undefined;
    let couponId: string | undefined;

    if (params.couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: params.couponCode.toUpperCase() },
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
        couponId = coupon.id;
      }
    }

    const totals = calculateOrderTotals({
      subtotal,
      discountValue,
      discountType,
      shippingMethod: params.shippingMethod,
    });

    const orderNumber = generateOrderNumber();

    // 2. Transactionally create Order, OrderItems, Payment record, and deduct stock
    const order = await db.$transaction(async (tx) => {
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
      cart.items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      order.id
    );

    // 4. Create in-app notifications
    await db.notification.create({
      data: {
        userId: params.userId,
        role: "CUSTOMER",
        title: "Order Confirmed!",
        message: `Order #${order.orderNumber} for $${order.totalAmount.toFixed(2)} has been placed successfully.`,
        type: "ORDER",
        link: `/orders/${order.id}/track`,
      },
    });

    // Group items by seller and notify sellers
    const sellerIds = Array.from(new Set(cart.items.map((i) => i.product.sellerId)));
    for (const sId of sellerIds) {
      const seller = await db.seller.findUnique({ where: { id: sId }, select: { userId: true } });
      if (seller) {
        await db.notification.create({
          data: {
            userId: seller.userId,
            role: "SELLER",
            title: "New Customer Order",
            message: `You have new items to fulfill in order #${order.orderNumber}.`,
            type: "ORDER",
            link: "/seller/orders",
          },
        });
      }
    }

    return order;
  }

  static async cancelOrder(orderId: string, userId: string, reason: string) {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    if (order.customerId !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    // Centralized state machine check
    validateOrderTransition(order.status, "CANCELLED");

    // Update order state
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        paymentStatus: "REFUNDED",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    // Restore inventory
    await InventoryService.restoreInventory(
      order.items.map((i) => ({
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
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    // Validate transition
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

    // Notify customer
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
