import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { OrderRepository } from "@/repositories";
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

  let order: any = await OrderRepository.findById(orderId);
  if (!order) {
    order = await db.order.findFirst({
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
  }

  if (!order) notFound();

  let address: any = {};
  if (typeof order.shippingAddress === "object" && order.shippingAddress) {
    address = order.shippingAddress;
  } else if (order.shippingAddressJson) {
    try {
      address = JSON.parse(order.shippingAddressJson);
    } catch (e) {
      address = {};
    }
  }

  const subtotal = order.subtotal ?? 0;
  const shippingCost = order.shippingCost ?? order.shippingFee ?? 0;
  const taxAmount = order.taxAmount ?? 0;
  const discountAmount = order.discountAmount ?? 0;
  const totalAmount = order.totalAmount ?? order.total ?? (subtotal + shippingCost + taxAmount - discountAmount);

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8 text-center sm:text-left px-4">
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
            <p className="font-bold text-slate-900">
              {order.shipment?.carrier || order.carrier || "MarketSphere Express"}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Estimated Delivery:</span>
            <p className="font-bold text-indigo-600">
              {order.shipment?.estimatedDelivery || (order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "3-5 Business Days")}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Ordered Items</h3>
          <div className="divide-y divide-slate-100">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
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
                <div className="text-right">
                  <span className="font-bold text-slate-900">
                    {formatPrice(item.subtotal || item.unitPrice * item.quantity)}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {formatPrice(item.unitPrice)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Estimated Tax</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
            <span>Total Paid</span>
            <span className="text-indigo-600">{formatPrice(totalAmount)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        {address && address.fullName && (
          <div className="border-t border-slate-100 pt-4 text-xs">
            <span className="font-bold text-slate-900 block mb-1">Shipping Destination:</span>
            <p className="text-slate-600 leading-relaxed">
              {address.fullName}<br />
              {address.street} {address.apartment && `, ${address.apartment}`}<br />
              {address.city}, {address.state} {address.postalCode}<br />
              {address.country}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          href={`/orders/${order.id}/track`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Truck className="w-4 h-4" /> Track Shipment
        </Link>
        <Link
          href="/search"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
