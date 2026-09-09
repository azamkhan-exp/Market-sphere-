import { DEMO_SELLERS, DEMO_PRODUCTS, DEMO_ORDERS } from "./demoData";
import { SellerItem } from "../types";

let inMemorySellers = [...DEMO_SELLERS];

export class DemoSellerRepository {
  static async getAll(): Promise<SellerItem[]> {
    return [...inMemorySellers];
  }

  static async findById(id: string): Promise<SellerItem | null> {
    const seller = inMemorySellers.find((s) => s.id === id);
    return seller ? { ...seller } : null;
  }

  static async findByUserId(userId: string): Promise<SellerItem | null> {
    const seller = inMemorySellers.find((s) => s.userId === userId);
    return seller ? { ...seller } : null;
  }

  static async findBySlug(slug: string): Promise<SellerItem | null> {
    const seller = inMemorySellers.find((s) => s.slug === slug);
    return seller ? { ...seller } : null;
  }

  static async updateStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"): Promise<SellerItem | null> {
    const idx = inMemorySellers.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    inMemorySellers[idx] = { ...inMemorySellers[idx], status };
    return inMemorySellers[idx];
  }

  static async getDashboardKPIs(sellerId: string) {
    const seller = inMemorySellers.find((s) => s.id === sellerId) || inMemorySellers[0];
    const products = DEMO_PRODUCTS.filter((p) => p.sellerId === seller.id);
    const orderItems = DEMO_ORDERS.flatMap((o) => o.items.filter((i) => i.sellerId === seller.id));

    const totalRevenue = orderItems.reduce((acc, i) => acc + i.subtotal, 0);
    const totalUnitsSold = orderItems.reduce((acc, i) => acc + i.quantity, 0);
    const activeOrders = new Set(orderItems.map((i) => i.orderId)).size;
    const lowStockCount = products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;

    return {
      storeName: seller.storeName,
      totalRevenue,
      netPayout: totalRevenue * (1 - seller.commissionRate / 100),
      totalUnitsSold,
      activeOrders,
      lowStockCount,
      totalProducts: products.length,
      rating: seller.rating,
      reviewCount: seller.reviewCount,
    };
  }
}
