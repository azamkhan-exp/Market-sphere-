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
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">MarketSphere Admin Suite</h1>
            <p className="text-xs text-slate-500">Platform moderation, vendor verification & executive analytics</p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Exit Admin to Storefront
        </Link>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold border-b border-slate-200">
        <Link
          href="/admin/dashboard"
          className="px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2 shrink-0 transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-indigo-600" /> Platform KPIs
        </Link>
        <Link
          href="/admin/sellers"
          className="px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2 shrink-0 transition-colors"
        >
          <Store className="w-4 h-4 text-indigo-600" /> Seller Verification
        </Link>
        <Link
          href="/admin/users"
          className="px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2 shrink-0 transition-colors"
        >
          <Users className="w-4 h-4 text-indigo-600" /> User Directory
        </Link>
        <Link
          href="/admin/coupons"
          className="px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2 shrink-0 transition-colors"
        >
          <Tag className="w-4 h-4 text-indigo-600" /> Discount Coupons
        </Link>
        <Link
          href="/admin/audit-logs"
          className="px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2 shrink-0 transition-colors"
        >
          <FileText className="w-4 h-4 text-indigo-600" /> Audit Trail
        </Link>
        <Link
          href="/admin/ai-insights"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center gap-2 shrink-0 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-300" /> AI Executive Insights
        </Link>
      </div>

      <div className="py-2">{children}</div>
    </div>
  );
}
