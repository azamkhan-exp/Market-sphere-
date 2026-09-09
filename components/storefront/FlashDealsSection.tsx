"use client";

import * as React from "react";
import { Timer, Zap } from "lucide-react";
import { ProductCard } from "./ProductCard";

export interface FlashDealsSectionProps {
  products: any[];
}

export function FlashDealsSection({ products }: FlashDealsSectionProps) {
  const [timeLeft, setTimeLeft] = React.useState({ hours: 14, minutes: 22, seconds: 48 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="my-8 sm:my-12 p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-orange-500/10 border border-red-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-red-600 text-white shadow-md shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
              Flash Deals <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-red-100 text-red-700">Limited Time</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Unbeatable prices on high-demand items while stock lasts</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-red-200 shrink-0 self-start sm:self-auto">
          <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-700 uppercase">Ends in:</span>
          <div className="flex gap-1 text-[11px] sm:text-xs font-mono font-bold text-red-600">
            <span className="bg-red-50 px-1 py-0.5 rounded">{String(timeLeft.hours).padStart(2, "0")}h</span>:
            <span className="bg-red-50 px-1 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, "0")}m</span>:
            <span className="bg-red-50 px-1 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, "0")}s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
