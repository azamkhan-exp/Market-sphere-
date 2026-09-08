import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Denied (403)</h1>
          <p className="text-sm text-slate-500">
            You do not have administrative privileges to access the MarketSphere Admin Suite.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
          <p className="font-semibold text-slate-800">Admin Account Credentials:</p>
          <p className="font-mono">Email: admin@marketsphere.com</p>
          <p className="font-mono">Password: AdminPass123!</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" /> Storefront
            </Button>
          </Link>
          <Link href="/login?redirect=/admin" className="flex-1">
            <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <LogIn className="w-4 h-4" /> Sign in as Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
