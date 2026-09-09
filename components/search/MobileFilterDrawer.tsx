"use client";

import * as React from "react";
import { X, SlidersHorizontal, Check } from "lucide-react";
import { Button } from "../ui/Button";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string; slug: string }[];
  currentParams: Record<string, string>;
  totalProducts: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  currentParams,
  totalProducts,
}: MobileFilterDrawerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(currentParams.category || "");
  const [minPrice, setMinPrice] = React.useState(currentParams.minPrice || "");
  const [maxPrice, setMaxPrice] = React.useState(currentParams.maxPrice || "");
  const [minRating, setMinRating] = React.useState(currentParams.minRating || "");
  const [inStockOnly, setInStockOnly] = React.useState(currentParams.inStock === "true");
  const [onSaleOnly, setOnSaleOnly] = React.useState(currentParams.onSale === "true");

  React.useEffect(() => {
    setSelectedCategory(currentParams.category || "");
    setMinPrice(currentParams.minPrice || "");
    setMaxPrice(currentParams.maxPrice || "");
    setMinRating(currentParams.minRating || "");
    setInStockOnly(currentParams.inStock === "true");
    setOnSaleOnly(currentParams.onSale === "true");
  }, [currentParams]);

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    const params = new URLSearchParams(currentParams);
    if (selectedCategory) params.set("category", selectedCategory);
    else params.delete("category");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (minRating) params.set("minRating", minRating);
    else params.delete("minRating");

    if (inStockOnly) params.set("inStock", "true");
    else params.delete("inStock");

    if (onSaleOnly) params.set("onSale", "true");
    else params.delete("onSale");

    params.delete("page"); // Reset to page 1
    window.location.href = `/search?${params.toString()}`;
  };

  const handleReset = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setInStockOnly(false);
    setOnSaleOnly(false);
    window.location.href = "/search";
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Bottom Sheet */}
      <div className="relative w-full max-h-[88vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Filters</h3>
            <span className="text-[11px] text-slate-500 font-medium">({totalProducts} products)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              aria-label="Close filters"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Content */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
              Category
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                  !selectedCategory
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === c.slug ? "" : c.slug)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                    selectedCategory === c.slug
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
              Price Range ($)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
              Customer Rating
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(minRating === String(r) ? "" : String(r))}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    minRating === String(r)
                      ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <span>{r}★ & above</span>
                  {minRating === String(r) && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability & Deals */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
              Availability & Deals
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-800">In Stock Only</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-800">On Sale / Discounts Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <Button
            onClick={handleApply}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
          >
            Show Results
          </Button>
        </div>
      </div>
    </div>
  );
}
