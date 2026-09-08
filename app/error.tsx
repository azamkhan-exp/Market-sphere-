"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log structured error for observability
    console.error("MarketSphere Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Something Went Wrong</h2>
          <p className="text-sm text-slate-500">
            An unexpected error occurred while processing your request. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" /> Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
