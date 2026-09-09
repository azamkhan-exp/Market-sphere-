"use client";

import * as React from "react";
import { Tag, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Form states
  const [code, setCode] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = React.useState("10");
  const [minOrderAmount, setMinOrderAmount] = React.useState("50");
  const [usageLimit, setUsageLimit] = React.useState("1000");
  const [creating, setCreating] = React.useState(false);

  const fetchCoupons = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderAmount: parseFloat(minOrderAmount),
          usageLimit: parseInt(usageLimit),
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setCode("");
        fetchCoupons();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create coupon");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Coupons & Discounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage promotional voucher codes and redemption limits</p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Mobile Card List (screens < md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {coupons.map((c) => (
            <div key={c.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {c.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {c.isActive ? "Active" : "Disabled"}
                </span>
              </div>
              {c.description && <p className="text-xs text-slate-600">{c.description}</p>}
              <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Discount</span>
                  <span className="font-bold text-slate-900">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `$${c.discountValue.toFixed(2)}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Min Spend</span>
                  <span className="font-bold text-slate-900">${c.minOrderAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Used / Limit</span>
                  <span className="font-bold text-slate-900">{c.timesUsed}/{c.usageLimit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (screens >= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Description</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Spend</th>
                <th className="p-4">Redemptions</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-slate-900">{c.code}</td>
                  <td className="p-4 text-slate-600">{c.description || "—"}</td>
                  <td className="p-4 font-bold text-indigo-600">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `$${c.discountValue.toFixed(2)} OFF`}
                  </td>
                  <td className="p-4">${c.minOrderAmount.toFixed(2)}</td>
                  <td className="p-4 text-slate-700">
                    {c.timesUsed} / {c.usageLimit}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Platform Coupon">
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Coupon Code (Uppercase)</label>
            <input
              type="text"
              required
              placeholder="e.g. FLASH25"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 font-mono text-xs uppercase"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. 25% off summer festival collection"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs bg-white"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Discount Value</label>
              <input
                type="number"
                step="0.01"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Min. Order Value ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Max Redemptions</label>
              <input
                type="number"
                required
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={creating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs mt-2"
          >
            Create Coupon
          </Button>
        </form>
      </Modal>
    </div>
  );
}
