"use client";

import * as React from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Star,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";

export default function SellerAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/seller/dashboard");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (e) {
        console.error("Failed to load seller analytics:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const kpis = analytics?.kpis || {
    grossRevenue: 48200.0,
    netPayout: 44103.0,
    totalUnitsSold: 320,
    totalOrders: 240,
    averageOrderValue: 200.83,
    returnRate: 1.2,
  };

  const salesData = [
    { month: "Jan", sales: 12500, units: 85 },
    { month: "Feb", sales: 18900, units: 120 },
    { month: "Mar", sales: 24200, units: 165 },
    { month: "Apr", sales: 21800, units: 140 },
    { month: "May", sales: 28400, units: 195 },
    { month: "Jun", sales: 34100, units: 230 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vendor Growth & Sales Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track revenue performance, fulfillment velocity, and customer retention metrics
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs">
          {["7d", "30d", "90d", "1y", "all"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[10px] transition-all ${
                timeRange === r
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Gross Store Sales</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(kpis.grossRevenue)}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.2% from last month
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Net Estimated Payout</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(kpis.netPayout)}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            After 8.5% platform commission
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Units Dispatched</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{kpis.totalUnitsSold} Units</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            Across {kpis.totalOrders} fulfilled customer orders
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Return & Refund Rate</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{kpis.returnRate}%</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            Excellent product quality standing
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm min-w-0 overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Monthly Revenue & Volume Progression</h3>
          <span className="text-xs text-slate-400">Past 6 Months</span>
        </div>
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: any) => [formatPrice(Number(v)), "Revenue"]} />
              <Bar dataKey="sales" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
