import { DEMO_ORDERS, DEMO_PRODUCTS } from "./demoData";
import { OrderRecord, OrderItemRecord } from "../types";

let inMemoryOrders = [...DEMO_ORDERS];

export class DemoOrderRepository {
  static async getAll(): Promise<OrderRecord[]> {
    return [...inMemoryOrders];
  }

  static async findById(id: string): Promise<OrderRecord | null> {
    const order = inMemoryOrders.find((o) => o.id === id || o.orderNumber === id);
    return order ? { ...order } : null;
  }

  static async findByUserId(userId: string): Promise<OrderRecord[]> {
    return inMemoryOrders.filter((o) => o.userId === userId);
  }

  static async findBySellerId(sellerId: string): Promise<OrderRecord[]> {
    return inMemoryOrders.filter((o) => o.items.some((i) => i.sellerId === sellerId));
  }

  static async create(data: {
    userId: string;
    items: Array<{ productId: string; variantId?: string | null; quantity: number; unitPrice: number; title?: string }>;
    shippingAddress: any;
    billingAddress?: any;
    shippingMethod: string;
    shippingCost: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    couponCode?: string | null;
    isGift?: boolean;
    giftMessage?: string | null;
    paymentMethod?: string;
    paymentIntentId?: string;
  }): Promise<OrderRecord> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MS-DEMO-${dateStr}-${randDigits}`;
    const orderId = `ord_demo_${Date.now()}`;

    const orderItems: OrderItemRecord[] = data.items.map((item, idx) => {
      const prod = DEMO_PRODUCTS.find((p) => p.id === item.productId);
      return {
        id: `itm_demo_${Date.now()}_${idx}`,
        orderId,
        productId: item.productId,
        variantId: item.variantId || null,
        sellerId: prod?.sellerId || "sel_apex_01",
        title: item.title || prod?.title || "Marketplace Product",
        sku: prod?.sku || `SKU-${Date.now()}`,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity,
        productImage: prod?.images?.[0]?.url || "/images/product-placeholder.svg",
        product: {
          id: item.productId,
          title: prod?.title || "Product",
          slug: prod?.slug || "",
          images: prod?.images || [{ url: "/images/product-placeholder.svg" }],
        },
      };
    });

    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber,
      userId: data.userId,
      status: "CONFIRMED",
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      taxAmount: data.taxAmount,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      shippingMethod: data.shippingMethod || "STANDARD",
      couponCode: data.couponCode || null,
      isGift: Boolean(data.isGift),
      giftMessage: data.giftMessage || null,
      paymentStatus: "SUCCEEDED",
      paymentMethod: data.paymentMethod || "DEMO_PAYMENT",
      items: orderItems,
      shipment: {
        carrier: "FedEx Ground",
        trackingNumber: `FX-DEMO-${Date.now().toString().slice(-8)}`,
        estimatedDelivery: "Estimated in 3-5 business days",
        status: "PREPARING",
      },
      user: { name: "Demo Customer", email: "customer@example.com" },
      createdAt: now,
      updatedAt: now,
    };

    inMemoryOrders.unshift(newOrder);
    return newOrder;
  }

  static async updateStatus(
    id: string,
    status: OrderRecord["status"],
    trackingNumber?: string,
    carrier?: string
  ): Promise<OrderRecord | null> {
    const idx = inMemoryOrders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (idx === -1) return null;

    inMemoryOrders[idx].status = status;
    inMemoryOrders[idx].updatedAt = new Date();

    if (trackingNumber || carrier) {
      inMemoryOrders[idx].shipment = {
        carrier: carrier || inMemoryOrders[idx].shipment?.carrier || "Standard Courier",
        trackingNumber: trackingNumber || inMemoryOrders[idx].shipment?.trackingNumber || `TRK-${Date.now()}`,
        status: status === "SHIPPED" ? "IN_TRANSIT" : status === "DELIVERED" ? "DELIVERED" : "PREPARING",
      };
    }

    return inMemoryOrders[idx];
  }
}
