"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, ShieldCheck, CheckCircle2, Building, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SellerRegisterPage() {
  const router = useRouter();
  const [storeName, setStoreName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [businessAddress, setBusinessAddress] = React.useState("");
  const [taxId, setTaxId] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [bankAccount, setBankAccount] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center mx-auto shadow-md">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Become a Verified MarketSphere Seller</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Reach hundreds of thousands of active buyers worldwide with low commission fees, robust fulfillment tooling, and AI copywriting.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Application Submitted!</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Your vendor application for <span className="font-bold">{storeName}</span> has been routed to the MarketSphere Moderation Team for verification.
          </p>
          <div className="pt-2">
            <Link href="/seller/dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
                View Seller Dashboard (Demo Mode) &rarr;
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-slate-200 bg-white space-y-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">Store / Legal Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Dynamics Ltd."
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">Business Description & Specialty</label>
              <textarea
                required
                rows={3}
                placeholder="Describe the products you manufacture or curate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Tax ID / EIN Number</label>
              <input
                type="text"
                required
                placeholder="US-XX-XXXXXXX"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">Registered Business Address</label>
              <input
                type="text"
                required
                placeholder="123 Commerce Way, City, State, ZIP"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">Payout Account (Routing / Account)</label>
              <input
                type="text"
                required
                placeholder="Bank Name & Account ending in XXXX"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs mt-4"
          >
            Submit Application for Moderation Review &rarr;
          </Button>

          <p className="text-[11px] text-slate-400 text-center">
            Standard platform commission is 8-10% only on successful sales. Zero listing or recurring subscription fees.
          </p>
        </form>
      )}
    </div>
  );
}
