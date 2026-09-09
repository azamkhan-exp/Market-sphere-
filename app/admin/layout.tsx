import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Store,
  Tag,
  FileText,
  BarChart3,
  Sparkles,
  ChevronLeft,
  Package,
  ShoppingBag,
  TrendingUp,
  Settings,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-sm shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">MarketSphere Admin Suite</h1>
            <p className="text-xs text-slate-500">Platform moderation, vendor verification & executive analytics</p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 self-start sm:self-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Exit Admin to Storefront
        </Link>
      </div>

      {/* Admin Subnav Tabs (Responsive Horizontal Scroll) */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 text-xs font-bold border-b border-slate-200">
        <Link
          href="/admin/dashboard"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Platform KPIs
        </Link>
        <Link
          href="/admin/analytics"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Executive Analytics
        </Link>
        <Link
          href="/admin/products"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Products
        </Link>
        <Link
          href="/admin/orders"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Orders
        </Link>
        <Link
          href="/admin/sellers"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Sellers
        </Link>
        <Link
          href="/admin/users"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Users
        </Link>
        <Link
          href="/admin/coupons"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Coupons
        </Link>
        <Link
          href="/admin/audit-logs"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Audit Trail
        </Link>
        <Link
          href="/admin/settings"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Settings
        </Link>
        <Link
          href="/admin/ai-insights"
          className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center gap-1.5 sm:gap-2 shrink-0 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> AI Insights
        </Link>
      </div>

      <div className="py-2">{children}</div>
    </div>
  );
}
