import { DEMO_ORDERS, DEMO_PRODUCTS, DEMO_SELLERS, DEMO_CATEGORIES } from "./demoData";

export class DemoAnalyticsRepository {
  static async getAdminAnalytics(timeRange = "30d") {
    const orders = DEMO_ORDERS;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 148500.0;
    const totalOrders = orders.length + 620;
    const aov = totalRevenue / totalOrders;
    const platformCommission = totalRevenue * 0.1; // 10%

    return {
      timeRange,
      kpis: {
        totalGmv: totalRevenue,
        platformRevenue: platformCommission,
        totalOrders,
        averageOrderValue: aov,
        activeSellers: DEMO_SELLERS.filter((s) => s.status === "APPROVED").length,
        totalProducts: DEMO_PRODUCTS.length + 120,
        conversionRate: 3.42,
      },
      revenueChart: [
        { date: "Day 1", revenue: 4200, orders: 18 },
        { date: "Day 5", revenue: 5800, orders: 24 },
        { date: "Day 10", revenue: 7900, orders: 31 },
        { date: "Day 15", revenue: 6400, orders: 28 },
        { date: "Day 20", revenue: 9200, orders: 42 },
        { date: "Day 25", revenue: 11400, orders: 50 },
        { date: "Day 30", revenue: 13800, orders: 62 },
      ],
      categoryDistribution: DEMO_CATEGORIES.map((cat, idx) => ({
        name: cat.name,
        value: 15 + idx * 8,
      })),
      recentOrders: orders.slice(0, 10),
    };
  }

  static async getSellerAnalytics(sellerId: string, timeRange = "30d") {
    const seller = DEMO_SELLERS.find((s) => s.id === sellerId) || DEMO_SELLERS[0];
    const sellerProducts = DEMO_PRODUCTS.filter((p) => p.sellerId === seller.id);

    const grossRevenue = sellerProducts.reduce((acc, p) => acc + (p.totalSales * (p.salePrice ?? p.basePrice)), 0) || 48200;
    const totalUnits = sellerProducts.reduce((acc, p) => acc + p.totalSales, 0) || 320;

    return {
      sellerId: seller.id,
      storeName: seller.storeName,
      timeRange,
      kpis: {
        grossRevenue,
        netPayout: grossRevenue * (1 - seller.commissionRate / 100),
        totalUnitsSold: totalUnits,
        totalOrders: Math.round(totalUnits * 0.75),
        averageOrderValue: grossRevenue / Math.max(1, Math.round(totalUnits * 0.75)),
        returnRate: 1.2,
      },
      salesChart: [
        { month: "Jan", sales: 12500, units: 85 },
        { month: "Feb", sales: 18900, units: 120 },
        { month: "Mar", sales: 24200, units: 165 },
        { month: "Apr", sales: 21800, units: 140 },
        { month: "May", sales: 28400, units: 195 },
        { month: "Jun", sales: 34100, units: 230 },
      ],
      topProducts: sellerProducts.slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        sku: p.sku,
        unitsSold: p.totalSales,
        revenue: p.totalSales * (p.salePrice ?? p.basePrice),
        stock: p.stockQuantity,
      })),
    };
  }
}
