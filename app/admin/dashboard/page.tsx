"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Store,
  Users,
  Package,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/Button";

const TIMEFRAMES = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "1y", label: "1 Year" },
  { key: "all", label: "All Time" },
];

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [timeframe, setTimeframe] = React.useState("30d");

  const loadDashboard = React.useCallback(async (tf: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/dashboard?timeframe=${tf}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard(timeframe);
  }, [timeframe, loadDashboard]);

  if (loading && !data) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading platform analytics...</p>
      </div>
    );
  }

  const { metrics, topCategories, topProducts, chartData, recentAuditLogs } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner & Timeframe Filters */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Platform Overview & Executive Health</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">MarketSphere Platform GMV</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real database metrics aggregated across verified independent merchants
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800 rounded-2xl border border-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tf.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Merchandise Value */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross GMV</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(metrics?.gmv || 0)}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold">Avg Order:</span> {formatPrice(metrics?.averageOrderValue || 0)}
          </p>
        </div>

        {/* Platform Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Take (10%)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(metrics?.platformRevenue || 0)}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Net commission earned by platform
          </p>
        </div>

        {/* Total Orders & Customers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Orders & Buyers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics?.totalOrders || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{metrics?.totalCustomers || 0}</span> active buyers in period
          </p>
        </div>

        {/* Sellers & Moderation Alert */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Merchants</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics?.totalSellers || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            {metrics?.pendingSellers > 0 ? (
              <span className="text-amber-600 font-bold">
                ⚠️ {metrics.pendingSellers} seller application(s) pending review
              </span>
            ) : (
              <span className="text-emerald-600">All vendor accounts up to date</span>
            )}
          </p>
        </div>
      </div>

      {/* AI Executive Intelligence Callout Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-purple-800/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Executive Business Analyst</h3>
            <p className="text-xs text-purple-200 mt-0.5">
              Ask deep questions about monthly revenue swings, top categories, return spikes, or vendor health.
            </p>
          </div>
        </div>
        <Link href="/admin/ai-insights">
          <Button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs gap-1.5 shadow-md shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> Launch AI Business Analyst &rarr;
          </Button>
        </Link>
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GMV Volume Area Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform GMV & Revenue Trend</h3>
              <p className="text-xs text-slate-500">Gross volume processed across time period</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "GMV"]}
                  contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid #e2e8f0" }}
                />
                <Area type="monotone" dataKey="gmv" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#gmvGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Top Categories by Sales</h3>
            <span className="text-xs text-slate-400">Share</span>
          </div>

          <div className="space-y-3 pt-2">
            {topCategories && topCategories.length > 0 ? (
              topCategories.map((cat: any, idx: number) => {
                const totalCatRev = topCategories.reduce((acc: number, c: any) => acc + c.revenue, 0) || 1;
                const pct = Math.round((cat.revenue / totalCatRev) * 100);

                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{cat.name}</span>
                      <span className="font-bold text-slate-900">{formatPrice(cat.revenue)} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No category orders in this timeframe.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products & Audit Logs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Platform SKUs (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Marketplace Best Sellers</h3>

          <div className="divide-y divide-slate-100">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((p: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{p.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{p.units} units ordered</p>
                  </div>
                  <span className="font-extrabold text-slate-900">{formatPrice(p.revenue)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No product orders recorded.</p>
            )}
          </div>
        </div>

        {/* Audit Log Stream (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Platform Audit Trail</h3>
            </div>
            <Link href="/admin/audit-logs" className="text-xs text-indigo-600 font-bold hover:underline">
              View Full Trail
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAuditLogs && recentAuditLogs.length > 0 ? (
              recentAuditLogs.map((log: any) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-indigo-700 block">{log.action}</span>
                    <span className="text-[11px] text-slate-500">
                      by {log.actor?.name || log.actorRole} on {log.entityType} #{log.entityId.slice(0, 8)}...
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No administrative actions logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
