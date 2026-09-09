"use client";

import * as React from "react";
import { Search, Package, Truck, CheckCircle2, Clock, Eye, AlertCircle } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  React.useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error("Failed to fetch orders:", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Order Operations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-vendor order fulfillment, customer deliveries, and escrow statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100">
            {orders.length} Active Orders
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order #, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading platform orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No orders found matching criteria.</div>
        ) : (
          <>
            {/* Mobile Card List (screens < md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((ord) => (
                <div key={ord.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 block text-xs">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(ord.createdAt)}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        ord.status === "DELIVERED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : ord.status === "SHIPPED"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Customer:</span>
                      <span className="font-semibold text-slate-800 text-right">{ord.user?.name || "Alex Mercer"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Email:</span>
                      <span className="text-[10px] text-slate-600 truncate max-w-[200px]">{ord.user?.email || "customer@example.com"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Items:</span>
                      <span className="text-slate-700 font-medium">{ord.items?.length || 1} item(s)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Total:</span>
                      <span className="font-black text-slate-900">{formatPrice(ord.totalAmount || ord.total || 0)}</span>
                    </div>
                    {(ord.shipment?.trackingNumber || ord.trackingNumber) && (
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 text-[10px]">Carrier:</span>
                        <span className="text-[10px] font-mono text-indigo-600">
                          {ord.shipment?.carrier || ord.carrier || "FedEx"} - {ord.shipment?.trackingNumber || ord.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (screens >= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Carrier & Tracking</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{ord.user?.name || "Alex Mercer"}</p>
                        <span className="text-[10px] text-slate-400">{ord.user?.email || "customer@example.com"}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {ord.items?.length || 1} item(s)
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatPrice(ord.totalAmount || ord.total || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                            ord.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : ord.status === "SHIPPED"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-700">{ord.shipment?.carrier || ord.carrier || "FedEx Ground"}</p>
                        <span className="text-[10px] font-mono text-slate-400">
                          {ord.shipment?.trackingNumber || ord.trackingNumber || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(ord.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
