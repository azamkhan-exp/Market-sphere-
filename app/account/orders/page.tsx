import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Truck, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/account/orders");

  const orders = await db.order.findMany({
    where: { customerId: session.userId },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
          seller: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Order History</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and track your past marketplace purchases</p>
        </div>
        <Link href="/search" className="text-xs font-semibold text-indigo-600 hover:underline">
          Shop More &rarr;
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you purchase products on MarketSphere, they will appear here with live tracking.
          </p>
          <Link
            href="/search"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between pb-3 border-b border-slate-100 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Order Placed</span>
                  <span className="font-bold text-slate-900">{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Order ID</span>
                  <span className="font-mono font-bold text-slate-900">#{order.orderNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total</span>
                  <span className="font-extrabold text-slate-900">{formatPrice(order.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span
                    className={`inline-block font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                        <ProductImage
                          src={item.product.images?.[0]?.url}
                          alt={item.title}
                          fill
                        />
                      </div>
                      <div>
                        <Link href={`/products/${item.product.slug}`} className="font-bold text-slate-900 hover:text-indigo-600 truncate max-w-sm block">
                          {item.title}
                        </Link>
                        <p className="text-[11px] text-slate-500">
                          Sold by {item.seller.storeName} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="pt-2 flex justify-end">
                <Link
                  href={`/orders/${order.id}/track`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Truck className="w-3.5 h-3.5" /> View Live Tracking & Delivery Timeline &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
