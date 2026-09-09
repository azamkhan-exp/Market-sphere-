"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Truck,
  Users,
  Download,
  Star,
  Sparkles,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { AiSellerAssistant } from "@/components/seller/AiSellerAssistant";

export default function SellerDashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [chartView, setChartView] = React.useState<"revenue" | "orders">("revenue");

  React.useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/seller/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleExportCSV = () => {
    if (!data?.recentOrderItems) return;

    const headers = ["Order ID", "Item Title", "SKU", "Quantity", "Subtotal ($)", "Status", "Date"];
    const rows = data.recentOrderItems.map((i: any) => [
      i.order.orderNumber,
      `"${i.title.replace(/"/g, '""')}"`,
      i.sku,
      i.quantity,
      i.subtotal.toFixed(2),
      i.sellerStatus,
      new Date(i.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r: any[]) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `marketsphere-orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading live vendor metrics...</p>
      </div>
    );
  }

  const { metrics, recentOrderItems, topProducts, lowStockProducts, recentReviews, chartData, seller } = data;

  return (
    <div className="space-y-8">
      {/* Top Welcome Notice & CSV Export */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
            <span>Store Status: {seller?.status || "APPROVED"}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">{seller?.storeName || "Vendor Dashboard"}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Commission Rate: {seller?.commissionRate || 10}% | Rating: {seller?.rating || 5.0} ★ ({seller?.reviewCount || 0} reviews)
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 gap-1.5 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" /> Export Orders CSV
          </Button>
          <Link href="/seller/products/new">
            <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> List New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(metrics.totalRevenue)}</p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span className="text-emerald-600 font-bold">Avg Order:</span> {formatPrice(metrics.averageOrderValue)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalOrders}</p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span className="text-indigo-600 font-bold">{metrics.totalCustomers}</span> unique customer{metrics.totalCustomers !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Inventory Units */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Stock</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalProducts} SKUs</p>
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{metrics.totalUnitsInStock}</span> total units in warehouse
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Restock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.lowStockCount}</p>
          <p className="text-[11px] text-amber-600 font-medium">
            {metrics.lowStockCount > 0 ? "Requires restock replenishment" : "Inventory levels healthy"}
          </p>
        </div>
      </div>

      {/* AI Seller Assistant */}
      <AiSellerAssistant />

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue & Volume Chart (8 cols) */}
        <div className="lg:col-span-8 p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sales Trend & Volume</h3>
              <p className="text-xs text-slate-500">Monthly revenue and order activity</p>
            </div>
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setChartView("revenue")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  chartView === "revenue" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                }`}
              >
                Revenue ($)
              </button>
              <button
                onClick={() => setChartView("orders")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  chartView === "orders" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                }`}
              >
                Orders Count
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-4 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === "revenue" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val: any) => [val, "Orders"]}
                    contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling SKUs (4 cols) */}
        <div className="lg:col-span-4 p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Top Performing SKUs</h3>
            <Link href="/seller/products" className="text-xs text-indigo-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((p: any) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                      <ProductImage src={p.image} alt={p.title} fill />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 truncate max-w-[140px]">{p.title}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{p.totalSales} units sold</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">{formatPrice(p.revenue)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No sales records yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Low-Stock & Recent Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low-Stock Replenishment List */}
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Restock Priority Queue</h3>
            </div>
            <Link href="/seller/inventory" className="text-xs text-indigo-600 font-bold hover:underline">
              Manage Stock
            </Link>
          </div>

          {lowStockProducts && lowStockProducts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {lowStockProducts.map((p: any) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{p.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono">SKU: {p.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-600">{p.stockQuantity} in stock</span>
                    <p className="text-[10px] text-slate-400">Threshold: {p.lowStockThreshold}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              ✓ All products have sufficient warehouse inventory.
            </p>
          )}
        </div>

        {/* Recent Customer Reviews */}
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-base font-bold text-slate-900">Recent Customer Reviews</h3>
            </div>
          </div>

          {recentReviews && recentReviews.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentReviews.map((r: any) => (
                <div key={r.id} className="py-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.user.name}</span>
                    <span className="text-amber-500 font-bold">{r.rating} ★</span>
                  </div>
                  <p className="text-[11px] text-indigo-600 font-semibold truncate">{r.product.title}</p>
                  <p className="text-slate-600 line-clamp-2">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No customer reviews received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
