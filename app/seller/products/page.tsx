import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const session = await getSession();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    redirect("/login?redirect=/seller/products");
  }

  const seller = await db.seller.findUnique({ where: { userId: session.userId } });
  const sellerId = seller ? seller.id : (await db.seller.findFirst())?.id!;

  const products = await db.product.findMany({
    where: { sellerId },
    include: {
      category: true,
      images: { take: 1 },
      _count: { select: { reviews: true, orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Product Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage pricing, catalog listings, and status</p>
        </div>
        <Link href="/seller/products/new">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Mobile Card View (visible on screens < md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {products.map((p) => (
            <div key={p.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">SKU: {p.sku}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                  <ProductImage src={p.images[0]?.url} alt={p.title} fill />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <h4 className="font-bold text-slate-900 truncate">{p.title}</h4>
                  <p className="text-[11px] text-indigo-600 font-semibold">{p.category?.name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-slate-900">{formatPrice(p.salePrice ?? p.basePrice)}</span>
                    <span
                      className={`font-semibold ${
                        p.stockQuantity <= 5 ? "text-red-600" : "text-slate-600"
                      }`}
                    >
                      ({p.stockQuantity} in stock)
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/products/${p.slug}`}
                className="block text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                View Live Listing &rarr;
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                      <ProductImage src={p.images[0]?.url} alt={p.title} fill />
                    </div>
                    <span className="font-bold text-slate-900 max-w-xs truncate block">{p.title}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{p.sku}</td>
                  <td className="p-4 text-slate-600">{p.category?.name}</td>
                  <td className="p-4 font-bold text-slate-900">
                    {formatPrice(p.salePrice ?? p.basePrice)}
                    {p.salePrice && (
                      <span className="text-[10px] text-slate-400 line-through block">
                        {formatPrice(p.basePrice)}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-bold ${
                        p.stockQuantity <= 5 ? "text-red-600" : "text-slate-800"
                      }`}
                    >
                      {p.stockQuantity} units
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
