"use client";

import * as React from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { useRouter } from "next/navigation";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const ORDER_STEPS = [
  { key: "PENDING", label: "Order Placed", desc: "Order submitted by customer" },
  { key: "CONFIRMED", label: "Payment Confirmed", desc: "Payment verified via Stripe" },
  { key: "PROCESSING", label: "Preparing Dispatch", desc: "Vendors packing your items" },
  { key: "SHIPPED", label: "Dispatched", desc: "Carrier in possession of package" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Courier on local route" },
  { key: "DELIVERED", label: "Delivered", desc: "Package delivered safely" },
];

export function OrderTrackerClient({ order }: { order: any }) {
  const router = useRouter();
  const [cancelling, setCancelling] = React.useState(false);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("Found a better price");

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "REFUNDED";
  const canCancel = ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (res.ok) {
        setCancelModalOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to cancel order");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Tracking Order #{order.orderNumber}
            </h1>
            {isCancelled && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                {order.status}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCancelModalOpen(true)}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50 font-bold"
          >
            Cancel Order
          </Button>
        )}
      </div>

      {/* Visual Timeline Stepper */}
      {!isCancelled ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-slate-200 text-xs gap-2">
            <div>
              <span className="text-slate-400 block">Carrier</span>
              <span className="font-bold text-slate-900">{order.carrier || "MarketSphere Express"}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tracking ID</span>
              <span className="font-mono font-bold text-indigo-600">{order.trackingNumber || "Assigned shortly"}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Estimated Arrival</span>
              <span className="font-bold text-emerald-600">
                {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "In 2-4 Days"}
              </span>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
            {ORDER_STEPS.map((s, idx) => {
              const isPast = idx <= (currentStepIndex === -1 ? 1 : currentStepIndex);
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={s.key} className="flex md:flex-col items-center gap-3 text-left md:text-center flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isPast
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isCurrent ? "text-indigo-600 font-extrabold" : isPast ? "text-slate-900" : "text-slate-400"}`}>
                      {s.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 max-w-[140px] leading-tight hidden md:block mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-red-600" /> Order has been {order.status}
          </p>
          {order.cancellationReason && (
            <p className="text-red-700">Reason: &quot;{order.cancellationReason}&quot;</p>
          )}
          <p className="text-slate-600">
            Stock has been automatically restored to inventory, and your payment was refunded.
          </p>
        </div>
      )}

      {/* Items in this order */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900">Items in this Delivery</h3>

        <div className="divide-y divide-slate-100">
          {order.items.map((item: any) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                  <ProductImage
                    src={item.product.images?.[0]?.url}
                    alt={item.title}
                    fill
                  />
                </div>
                <div>
                  <Link href={`/products/${item.product.slug}`} className="font-bold text-slate-900 hover:text-indigo-600">
                    {item.title}
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Vendor: {item.seller.storeName} | Qty: {item.quantity}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Status: {item.sellerStatus}
                  </span>
                </div>
              </div>
              <span className="font-bold text-slate-900">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel this Order">
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to cancel order #{order.orderNumber}? This will issue an immediate refund and restore products to vendor inventory.
          </p>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">Cancellation Reason</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs bg-white"
            >
              <option value="Found a better price">Found a better price</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Shipping time too slow">Shipping time too slow</option>
              <option value="Need to change shipping address">Need to change shipping address</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCancelModalOpen(false)} className="flex-1">
              Keep Order
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={cancelling}
              onClick={handleCancelOrder}
              className="flex-1"
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
