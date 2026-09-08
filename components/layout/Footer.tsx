import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-20">
      {/* Trust Badges Row */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">Orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">100% Genuine Guarantee</h4>
              <p className="text-xs text-slate-400">Verified multi-vendor catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">30-Day Hassle-Free Return</h4>
              <p className="text-xs text-slate-400">Instant label printing</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Stripe 256-bit Security</h4>
              <p className="text-xs text-slate-400">Safe end-to-end encryption</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Col */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              MS
            </div>
            <span className="text-lg font-black text-white tracking-tight">MarketSphere</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
            MarketSphere is a modern multi-vendor marketplace connecting discerning buyers with verified independent brands, artisans, and manufacturers globally.
          </p>
          <div className="pt-2 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} MarketSphere Inc. All rights reserved.
          </div>
        </div>

        {/* Col 1 */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop & Explore</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/search?category=electronics" className="hover:text-white transition-colors">Electronics & PCs</Link></li>
            <li><Link href="/search?category=home-living" className="hover:text-white transition-colors">Home & Living</Link></li>
            <li><Link href="/search?category=fashion" className="hover:text-white transition-colors">Fashion & Apparel</Link></li>
            <li><Link href="/search?category=sports-fitness" className="hover:text-white transition-colors">Sports & Fitness</Link></li>
            <li><Link href="/search?flashDeal=true" className="hover:text-white transition-colors">Flash Deals</Link></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Sell on MarketSphere</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/seller/register" className="hover:text-white transition-colors">Seller Registration</Link></li>
            <li><Link href="/seller/dashboard" className="hover:text-white transition-colors">Vendor Portal</Link></li>
            <li><Link href="/seller/register" className="hover:text-white transition-colors">Fee Schedule & Policies</Link></li>
            <li><Link href="/seller/register" className="hover:text-white transition-colors">Fulfillment by MarketSphere</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
            <li><Link href="/account/addresses" className="hover:text-white transition-colors">Shipping Rates & Policies</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">Returns & Replacements</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">Help & FAQ</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
