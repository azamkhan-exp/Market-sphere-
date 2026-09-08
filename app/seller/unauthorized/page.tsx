import * as React from "react";
import Link from "next/link";
import { Store, ArrowLeft, LogIn, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SellerUnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Store className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Seller Access Required</h1>
          <p className="text-sm text-slate-500">
            You must have an approved Seller account to access this vendor hub feature.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
          <p className="font-semibold text-slate-800">Demo Seller Credentials:</p>
          <p className="font-mono">Email: seller@apextech.com</p>
          <p className="font-mono">Password: SellerPass123!</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/seller/register" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <PlusCircle className="w-4 h-4" /> Open Store
            </Button>
          </Link>
          <Link href="/login?redirect=/seller" className="flex-1">
            <Button className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
              <LogIn className="w-4 h-4" /> Sign In as Seller
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
