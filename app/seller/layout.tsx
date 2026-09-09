import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Warehouse,
  ShoppingBag,
  Store,
  ChevronLeft,
  TrendingUp,
} from "lucide-react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Vendor Management Hub</h1>
            <p className="text-xs text-slate-500">Manage catalog, live inventory, and multi-vendor orders</p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 self-start sm:self-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Storefront
        </Link>
      </div>

      {/* Seller Subnav Tabs (Responsive Scroll) */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 text-xs font-bold border-b border-slate-200">
        <Link
          href="/seller/dashboard"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Analytics & KPIs
        </Link>
        <Link
          href="/seller/analytics"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Payout Analytics
        </Link>
        <Link
          href="/seller/products"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Product Catalog
        </Link>
        <Link
          href="/seller/products/new"
          className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add Product (AI)
        </Link>
        <Link
          href="/seller/inventory"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <Warehouse className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Stock & Inventory
        </Link>
        <Link
          href="/seller/orders"
          className="px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> Orders & Fulfillment
        </Link>
      </div>

      <div className="py-2">{children}</div>
    </div>
  );
}
