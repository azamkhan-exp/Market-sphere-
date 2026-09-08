import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { db } from "@/lib/db";
import { CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await db.order.findFirst({
    where: {
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
          seller: true,
        },
      },
    },
  });

  if (!order) notFound();

  let address: any = {};
  try {
    address = JSON.parse(order.shippingAddressJson);
  } catch (e) {}

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8 text-center sm:text-left">
      {/* Success Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          We have received your payment and notified our verified sellers to begin packaging your items.
        </p>
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 shadow-sm">
            Order #{order.orderNumber}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-slate-100 gap-2 text-xs">
          <div>
            <span className="text-slate-400">Order Date:</span>
            <p className="font-bold text-slate-900">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <span className="text-slate-400">Status:</span>
            <p className="font-bold text-emerald-600">{order.status}</p>
          </div>
          <div>
            <span className="text-slate-400">Carrier:</span>
            <p className="font-bold text-slate-900">{order.carrier || "MarketSphere Express"}</p>
          </div>
          <div>
            <span className="text-slate-400">Estimated Delivery:</span>
            <p className="font-bold text-indigo-600">
              {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "3-5 Business Days"}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Ordered Items</h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    <ProductImage
                      src={item.product.images?.[0]?.url}
                      alt={item.title}
                      fill
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      Seller: {item.seller.storeName} | Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-slate-100 text-xs space-y-1.5 max-w-xs ml-auto">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount ({order.couponCode}):</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping:</span>
            <span className="font-bold text-slate-900">
              {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax:</span>
            <span className="font-bold text-slate-900">{formatPrice(order.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Paid:</span>
            <span className="text-indigo-600">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
          <p className="font-bold text-slate-900 mb-1">Delivering to:</p>
          <p>{address.fullName}</p>
          <p>{address.street}{address.apartment ? `, ${address.apartment}` : ""}</p>
          <p>{address.city}, {address.state} {address.postalCode}</p>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
        <Link href="/" className="text-indigo-600 font-semibold hover:underline">
          &larr; Return to Marketplace Home
        </Link>
        <Link
          href={`/orders/${order.id}/track`}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
        >
          <Truck className="w-4 h-4" /> Live Tracking Timeline <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
