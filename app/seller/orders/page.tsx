"use client";

import * as React from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { Truck, CheckCircle2, Printer, Search } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function SellerOrdersPage() {
  const [orderItems, setOrderItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [trackingNumber, setTrackingNumber] = React.useState("");
  const [updating, setUpdating] = React.useState(false);

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/seller/orders");
      if (res.ok) {
        const data = await res.json();
        setOrderItems(data.orderItems || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (itemId: string, newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/seller/orders/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerStatus: newStatus,
          trackingNumber: trackingNumber || undefined,
        }),
      });

      if (res.ok) {
        setSelectedItem(null);
        setTrackingNumber("");
        fetchOrders();
      } else {
        alert("Failed to update order item status");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading vendor orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Orders & Fulfillment Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Process new purchases, dispatch items, and attach live carrier tracking numbers
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Mobile Card List (visible on screens < md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {orderItems.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 block text-xs">
                    #{item.order.orderNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">{formatDate(item.createdAt)}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.sellerStatus === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.sellerStatus === "SHIPPED"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.sellerStatus}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                  <ProductImage src={item.product.images?.[0]?.url} alt={item.title} fill />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-slate-900 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500">Qty: {item.quantity} · Payout: {formatPrice(item.subtotal)}</p>
                  {item.trackingNumber && (
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">Track: {item.trackingNumber}</p>
                  )}
                </div>
              </div>

              {item.sellerStatus !== "DELIVERED" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setTrackingNumber(item.trackingNumber || `MS-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 cursor-pointer"
                >
                  Update Status / Fulfill
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Product Item</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Payout</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4">Tracking Number</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orderItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 block">
                      #{item.order.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(item.createdAt)}</span>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                      <ProductImage src={item.product.images?.[0]?.url} alt={item.title} fill />
                    </div>
                    <span className="font-bold text-slate-800 max-w-xs truncate block">{item.title}</span>
                  </td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4 font-bold text-slate-900">{formatPrice(item.subtotal)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.sellerStatus === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.sellerStatus === "SHIPPED"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.sellerStatus}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-600">
                    {item.trackingNumber || "—"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.sellerStatus !== "DELIVERED" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setTrackingNumber(item.trackingNumber || `MS-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] h-8 px-3"
                        >
                          Update Status
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fulfillment Status Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Fulfill Order #${selectedItem.order.orderNumber}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-slate-800">Product:</p>
              <p className="text-slate-600">{selectedItem.title} (Qty: {selectedItem.quantity})</p>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Carrier Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. UPS-1Z9999999999999999"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 font-mono text-xs bg-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(selectedItem.id, "SHIPPED")}
                isLoading={updating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Mark as Shipped 🚚
              </Button>
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(selectedItem.id, "DELIVERED")}
                isLoading={updating}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Mark as Delivered ✓
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
