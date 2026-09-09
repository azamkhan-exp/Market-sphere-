"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

interface SearchMobileControlsProps {
  categories: { id: string; name: string; slug: string }[];
  currentParams: Record<string, string>;
  totalProducts: number;
}

export function SearchMobileControls({
  categories,
  currentParams,
  totalProducts,
}: SearchMobileControlsProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Compute active filters count
  const activeCount = [
    currentParams.category,
    currentParams.brand,
    currentParams.minPrice,
    currentParams.maxPrice,
    currentParams.rating,
    currentParams.inStock === "true" ? "inStock" : null,
    currentParams.onSale === "true" ? "onSale" : null,
    currentParams.flashDeal === "true" ? "flashDeal" : null,
  ].filter(Boolean).length;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(currentParams);
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(currentParams);
    params.delete(key);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="md:hidden space-y-3">
      {/* Action Bar */}
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex-1 h-10 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Sort Select */}
        <div className="relative flex-1">
          <select
            value={currentParams.sort || "relevance"}
            onChange={handleSortChange}
            className="w-full h-10 pl-8 pr-4 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm appearance-none cursor-pointer"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="best-selling">Sort: Best Selling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Releases</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentParams.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
              Category: {currentParams.category}
              <button onClick={() => removeFilter("category")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.minPrice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
              Min: ${currentParams.minPrice}
              <button onClick={() => removeFilter("minPrice")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.maxPrice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
              Max: ${currentParams.maxPrice}
              <button onClick={() => removeFilter("maxPrice")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.rating && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
              {currentParams.rating}★+
              <button onClick={() => removeFilter("rating")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.inStock === "true" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              In Stock
              <button onClick={() => removeFilter("inStock")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.onSale === "true" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
              On Sale
              <button onClick={() => removeFilter("onSale")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Drawer Component */}
      <MobileFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        currentParams={currentParams}
        totalProducts={totalProducts}
      />
    </div>
  );
}
