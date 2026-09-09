import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Warehouse, AlertTriangle, CheckCircle2, History } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SellerInventoryPage() {
  const session = await getSession();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    redirect("/login?redirect=/seller/inventory");
  }

  const seller = await db.seller.findUnique({ where: { userId: session.userId } });
  const sellerId = seller ? seller.id : (await db.seller.findFirst())?.id!;

  const products = await db.product.findMany({
    where: { sellerId },
    include: {
      inventories: true,
      variants: true,
    },
    orderBy: { stockQuantity: "asc" },
  });

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;
  const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Real-Time Inventory Control</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor stock thresholds, reserved quantities, and prevent overselling
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Units in Stock</span>
          <h3 className="text-2xl font-black text-slate-900">{totalUnits} units</h3>
          <p className="text-[11px] text-slate-500">Across {products.length} catalog items</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Low Stock Warnings</span>
          <h3 className="text-2xl font-black text-amber-600">{lowStockCount} items</h3>
          <p className="text-[11px] text-amber-700">Operating below safety threshold</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Inventory Health</span>
          <h3 className="text-2xl font-black text-emerald-600">
            {Math.round(((products.length - lowStockCount) / Math.max(1, products.length)) * 100)}%
          </h3>
          <p className="text-[11px] text-emerald-700">Healthy replenishment index</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Mobile Card View (visible on screens < md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {products.map((p) => {
            const isLow = p.stockQuantity <= p.lowStockThreshold;
            return (
              <div key={p.id} className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400">SKU: {p.sku}</span>
                  {isLow ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Low Stock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Optimal
                    </span>
                  )}
                </div>

                <p className="font-bold text-slate-900 text-sm">{p.title}</p>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">On Hand</p>
                    <p className="font-black text-slate-900 text-sm mt-0.5">{p.stockQuantity}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Reserved</p>
                    <p className="font-bold text-slate-600 text-sm mt-0.5">{p.reservedQuantity}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Alert Level</p>
                    <p className="font-bold text-slate-600 text-sm mt-0.5">{p.lowStockThreshold}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">SKU & Item Title</th>
                <th className="p-4">Units on Hand</th>
                <th className="p-4">Reserved in Carts</th>
                <th className="p-4">Low Stock Alert Level</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {products.map((p) => {
                const isLow = p.stockQuantity <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{p.title}</span>
                      <span className="font-mono text-[11px] text-slate-400">SKU: {p.sku}</span>
                    </td>
                    <td className="p-4 font-bold text-sm text-slate-900">{p.stockQuantity}</td>
                    <td className="p-4 text-slate-500">{p.reservedQuantity}</td>
                    <td className="p-4 text-slate-500">{p.lowStockThreshold} units</td>
                    <td className="p-4">
                      {isLow ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
