"use client";

import * as React from "react";
import Link from "next/link";
import { ProductImage } from "../ui/ProductImage";
import { ArrowRight, ShieldCheck, Zap, Truck, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl my-6">
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:py-28 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Copy & CTAs */}
        <div className="max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen Multi-Vendor Commerce</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Curated Quality. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
              Verified Independent Sellers.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
            Discover thousands of high-performance tech workstations, artisanal home living, and precision fitness gear with authentic reviews and buyer protection.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/search">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 font-semibold gap-2">
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/search?flashDeal=true">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 text-white hover:bg-white/10 font-semibold gap-2">
                ⚡ Flash Deals of the Day
              </Button>
            </Link>
          </div>

          {/* Trust Value Props */}
          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">100% Genuine</p>
                <p className="text-[11px] text-slate-400">Verified Sellers Only</p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <Truck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Expedited Shipping</p>
                <p className="text-[11px] text-slate-400">Overnight Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">AI-Powered</p>
                <p className="text-[11px] text-slate-400">Instant Shopping Help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Showcase Card */}
        <div className="relative w-full max-w-md lg:max-w-none lg:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-800/50 backdrop-blur-sm">
          <ProductImage
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
            alt="MarketSphere Showcase"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-400 font-semibold">Featured Workstation</p>
                <h4 className="text-sm font-bold text-white">ApexBook Pro M3 Max</h4>
              </div>
              <span className="text-sm font-extrabold text-indigo-300">$2,299.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
