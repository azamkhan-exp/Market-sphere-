"use client";

import * as React from "react";
import {
  Settings,
  ShieldCheck,
  Cpu,
  CreditCard,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Save,
  Globe,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = React.useState("10.0");
  const [currency, setCurrency] = React.useState("USD");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Administration & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure multi-vendor commission structures, deployment modes, and global marketplace policies
        </p>
      </div>

      {/* Deployment Mode Status Card */}
      <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Runtime Execution Mode</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Database-Off Production Mode
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          MarketSphere is operating in decoupled production mode with in-memory repositories. Vercel serverless functions execute without requiring an active PostgreSQL or external database connection.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Economics */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Percent className="w-4 h-4 text-indigo-600" /> Marketplace Economics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Platform Commission (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Standard cut deducted from each seller order item upon fulfillment.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Settlement Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="CAD">CAD ($) — Canadian Dollar</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Primary currency used for customer charges and payout calculations.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Platform Infrastructure Toggles
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-bold text-slate-800">Payment Gateway Safe Test Simulator</p>
                <p className="text-slate-500 text-[11px]">Enables risk-free demo checkouts with simulated Stripe intents</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-slate-800">Grounded AI Shopping & Vendor Assistant</p>
                <p className="text-slate-500 text-[11px]">Synthesizes catalog data and seller metrics with zero hallucinations</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-slate-800">Public Vendor Onboarding</p>
                <p className="text-slate-500 text-[11px]">Allows new merchants to apply for storefront verification</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                OPEN
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Save className="w-4 h-4" /> Save Policy Changes
          </button>

          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Platform settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
