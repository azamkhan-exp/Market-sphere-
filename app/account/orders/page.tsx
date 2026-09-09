import { getSession } from "@/lib/auth";
import { OrderRepository } from "@/repositories";
import { isDemoMode } from "@/lib/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Truck, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session && !isDemoMode()) {
    redirect("/login?redirect=/account/orders");
  }

  const userId = session?.userId || "usr_customer_01";
  let orders = await OrderRepository.findByUserId(userId);
  if (orders.length === 0 && isDemoMode()) {
    orders = await OrderRepository.getAll();
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 px-4">
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
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-slate-400 ml-2">
                    Placed on {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">
                    {formatPrice(order.totalAmount || order.total || 0)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : order.status === "CANCELLED"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                        <ProductImage
                          src={item.product?.images?.[0]?.url || item.productImage}
                          alt={item.title}
                          fill
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          Seller: {item.seller?.storeName || "Verified Merchant"} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">
                      {formatPrice(item.subtotal || item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Carrier: {order.shipment?.carrier || order.carrier || "Standard Courier"}
                </span>
                <Link
                  href={`/orders/${order.id}/track`}
                  className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <Truck className="w-3.5 h-3.5" /> Track Package <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
