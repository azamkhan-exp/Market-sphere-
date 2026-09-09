"use client";

import * as React from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Calendar,
  Percent,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/dashboard?range=${timeRange}`);
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (e) {
        console.error("Failed to load analytics:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeRange]);

  const kpis = analytics?.metrics || {
    totalRevenue: 154280.0,
    totalOrders: 642,
    activeSellers: 4,
    totalProducts: 32,
    platformFee: 15428.0,
    conversionRate: 3.42,
    averageOrderValue: 240.31,
  };

  const chartData = [
    { name: "Week 1", revenue: 24500, orders: 112 },
    { name: "Week 2", revenue: 38200, orders: 158 },
    { name: "Week 3", revenue: 42900, orders: 184 },
    { name: "Week 4", revenue: 48680, orders: 188 },
  ];

  const categoryShare = [
    { name: "Computers", value: 45 },
    { name: "Audio", value: 25 },
    { name: "Home & Living", value: 18 },
    { name: "Fitness", value: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Platform Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial performance, multi-vendor commission yields, and cohort trends
          </p>
        </div>

        {/* Time range selector */}
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
            <span>Gross Merchandise (GMV)</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(kpis.totalRevenue)}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% from previous period
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Platform Take Rate (10%)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(kpis.platformFee)}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> Net platform retained margin
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Average Order Value</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(kpis.averageOrderValue)}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            Across {kpis.totalOrders} fulfilled transactions
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Conversion Rate</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{kpis.conversionRate}%</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> Top decile e-commerce benchmark
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm min-w-0 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-900">Gross Platform Revenue Trend</h3>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(value: any) => [formatPrice(Number(value)), "GMV"]} />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGmv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm min-w-0 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-900">Category GMV Share (%)</h3>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryShare} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[0, 50]} unit="%" />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={80} />
                <Tooltip formatter={(v: any) => [`${v}%`, "Share"]} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
