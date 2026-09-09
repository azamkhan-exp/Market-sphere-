import { CategoryRepository } from "@/repositories";
import { ProductService } from "@/services/productService";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { FlashDealsSection } from "@/components/storefront/FlashDealsSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, flashDeals, bestSellers, newArrivals] = await Promise.all([
    CategoryRepository.getFeatured(8),
    ProductService.getFlashDeals(4),
    ProductService.getBestSellers(8),
    ProductService.getNewArrivals(8),
  ]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Popular Categories */}
      <CategoryGrid categories={categories} />

      {/* 3. Flash Deals with Countdown */}
      <FlashDealsSection products={flashDeals} />

      {/* 4. Best Sellers */}
      <section className="my-8 sm:my-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Best Sellers</h2>
              <p className="text-xs text-slate-500">Most popular choices across the marketplace</p>
            </div>
          </div>
          <Link
            href="/search?sort=best-selling"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Promotional Mid-Page Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-5 sm:p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 shadow-xl">
        <div className="max-w-xl">
          <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest">Limited Seasonal Promotion</span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black mt-1 sm:mt-2">Elevate Your Lifestyle & Productivity</h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Save up to $50 on orders above $250 with code <span className="font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">SUMMER50</span> at checkout.
          </p>
        </div>
        <Link
          href="/search"
          className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shrink-0 shadow-md"
        >
          Shop Seasonal Deals
        </Link>
      </div>

      {/* 6. New Arrivals */}
      <section className="my-8 sm:my-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
              <p className="text-xs text-slate-500">Freshly listed products from our top-rated vendor community</p>
            </div>
          </div>
          <Link
            href="/search?sort=newest"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0"
          >
            Explore new <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
