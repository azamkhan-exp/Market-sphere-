import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { AnalyticsRepository, UserRepository, SellerRepository, ProductRepository, CategoryRepository } from "@/repositories";
import { db } from "@/lib/db";
import { DEMO_AUDIT_LOGS, DEMO_SELLERS, DEMO_ORDERS, DEMO_PRODUCTS } from "@/repositories/demo/demoData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    let session = await getSession();
    if (!session && isDemoMode()) {
      session = {
        userId: "usr_admin_01",
        email: "admin@marketsphere.com",
        name: "Victoria Sterling (Admin)",
        role: "ADMIN",
      };
    }

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || searchParams.get("range") || "30d";

    const analytics = await AnalyticsRepository.getAdminAnalytics(timeframe);

    const metrics = {
      totalUsers: 8,
      totalSellers: DEMO_SELLERS.filter((s) => s.status === "APPROVED").length,
      pendingSellers: DEMO_SELLERS.filter((s) => s.status === "PENDING").length,
      totalProducts: DEMO_PRODUCTS.length,
      ordersCount: DEMO_ORDERS.length + 620,
      totalRevenue: analytics.kpis.totalGmv,
      platformFee: analytics.kpis.platformRevenue,
      netPayouts: analytics.kpis.totalGmv * 0.9,
      refundCount: 2,
      refundTotal: 349.0,
      averageOrderValue: analytics.kpis.averageOrderValue,
      conversionRate: analytics.kpis.conversionRate,
    };

    const categoryDistribution = analytics.categoryDistribution;
    const recentAuditLogs = DEMO_AUDIT_LOGS.slice(0, 10);
    const recentOrders = DEMO_ORDERS.slice(0, 5);

    return NextResponse.json({
      metrics,
      timeframe,
      revenueChart: analytics.revenueChart,
      categoryDistribution,
      recentAuditLogs,
      recentOrders,
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
