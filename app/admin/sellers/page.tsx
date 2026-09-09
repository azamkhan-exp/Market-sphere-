"use client";

import * as React from "react";
import { Check, X, ShieldAlert, Store, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function AdminSellersPage() {
  const [sellers, setSellers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const fetchSellers = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/sellers");
      if (res.ok) {
        const data = await res.json();
        setSellers(data.sellers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const handleUpdateStatus = async (sellerId: string, newStatus: string) => {
    try {
      setUpdatingId(sellerId);
      const res = await fetch("/api/admin/sellers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, status: newStatus }),
      });
      if (res.ok) {
        fetchSellers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading seller applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Seller Verification & Governance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve new vendor registrations, monitor ratings, and manage commissions
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Mobile Card List (screens < md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {sellers.map((s) => (
            <div key={s.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">{s.storeName}</span>
                  <span className="text-[10px] text-slate-400">Created: {formatDate(s.createdAt)}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800"
                      : s.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Owner:</span>
                  <span className="text-[11px] font-mono text-slate-700 truncate max-w-[200px]">{s.user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Products Listed:</span>
                  <span className="text-slate-800 font-semibold">{s._count?.products || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Commission:</span>
                  <span className="text-slate-900 font-bold">{s.commissionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Vendor Rating:</span>
                  <span className="font-bold text-amber-600">⭐ {s.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {s.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(s.id, "APPROVED")}
                      isLoading={updatingId === s.id}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 cursor-pointer"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleUpdateStatus(s.id, "REJECTED")}
                      isLoading={updatingId === s.id}
                      className="flex-1 text-xs h-9 cursor-pointer"
                    >
                      Reject
                    </Button>
                  </>
                )}

                {s.status === "APPROVED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(s.id, "SUSPENDED")}
                    isLoading={updatingId === s.id}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs h-9 cursor-pointer"
                  >
                    Suspend Vendor
                  </Button>
                )}

                {s.status === "SUSPENDED" && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(s.id, "APPROVED")}
                    isLoading={updatingId === s.id}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 cursor-pointer"
                  >
                    Reactivate Vendor
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (screens >= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Store Name</th>
                <th className="p-4">Owner Email</th>
                <th className="p-4">Products</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{s.storeName}</span>
                    <span className="text-[11px] text-slate-400">Created: {formatDate(s.createdAt)}</span>
                  </td>
                  <td className="p-4 text-slate-600">{s.user.email}</td>
                  <td className="p-4 text-slate-700">{s._count?.products || 0} listed</td>
                  <td className="p-4 font-bold text-slate-900">{s.commissionRate}%</td>
                  <td className="p-4">⭐ {s.rating.toFixed(1)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {s.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(s.id, "APPROVED")}
                            isLoading={updatingId === s.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-8 px-3"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUpdateStatus(s.id, "REJECTED")}
                            isLoading={updatingId === s.id}
                            className="text-[11px] h-8 px-3"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {s.status === "APPROVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(s.id, "SUSPENDED")}
                          isLoading={updatingId === s.id}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-[11px] h-8 px-3"
                        >
                          Suspend
                        </Button>
                      )}

                      {s.status === "SUSPENDED" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(s.id, "APPROVED")}
                          isLoading={updatingId === s.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-8 px-3"
                        >
                          Reactivate
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
    </div>
  );
}
