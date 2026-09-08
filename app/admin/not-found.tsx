import * as React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminNotFound() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Admin Resource Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested administrative resource, moderation record, or settings page could not be located.
          </p>
        </div>

        <Link href="/admin/dashboard">
          <Button className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white">
            <ArrowLeft className="w-4 h-4" /> Return to Admin KPIs
          </Button>
        </Link>
      </div>
    </div>
  );
}
