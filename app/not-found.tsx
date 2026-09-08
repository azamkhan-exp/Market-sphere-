import * as React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalNotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-sm text-slate-500">
            We couldn&apos;t find the product, category, or page you were looking for. It might have been relocated or is currently unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/" className="flex-1">
            <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <ArrowLeft className="w-4 h-4" /> Go to Storefront
            </Button>
          </Link>
          <Link href="/search" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Search className="w-4 h-4" /> Search Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
