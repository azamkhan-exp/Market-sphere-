import { ProductService } from "@/services/productService";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SearchMobileControls } from "@/components/search/SearchMobileControls";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
    onSale?: string;
    flashDeal?: string;
    sort?: "relevance" | "price-asc" | "price-desc" | "rating" | "newest" | "best-selling";
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const query = params.q || undefined;
  const categorySlug = params.category || undefined;
  const brandSlug = params.brand || undefined;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const minRating = params.rating ? parseFloat(params.rating) : undefined;
  const inStockOnly = params.inStock === "true";
  const onSaleOnly = params.onSale === "true";
  const flashDealOnly = params.flashDeal === "true";
  const sort = params.sort || "relevance";
  const page = parseInt(params.page || "1");

  const [{ products, pagination }, categories, brands] = await Promise.all([
    ProductService.searchProducts({
      query,
      category: categorySlug,
      brand: brandSlug,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly,
      onSaleOnly,
      flashDealOnly,
      sort,
      page,
      limit: 16,
    }),
    db.category.findMany({ select: { id: true, name: true, slug: true } }),
    db.brand.findMany({ select: { id: true, name: true, slug: true } }),
  ]);

  const cleanParamsRecord: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) cleanParamsRecord[k] = v;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {query ? `Search results for "${query}"` : categorySlug ? `Category: ${categorySlug}` : "All Marketplace Products"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {products.length} of {pagination.total} product{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        {/* Desktop Sort Select */}
        <div className="hidden md:flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Sort by:</span>
          <div className="flex gap-1 text-xs">
            <Link
              href={`/search?${new URLSearchParams({ ...params, sort: "relevance" }).toString()}`}
              className={`px-3 py-1.5 rounded-lg border ${sort === "relevance" ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Relevance
            </Link>
            <Link
              href={`/search?${new URLSearchParams({ ...params, sort: "best-selling" }).toString()}`}
              className={`px-3 py-1.5 rounded-lg border ${sort === "best-selling" ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Best Selling
            </Link>
            <Link
              href={`/search?${new URLSearchParams({ ...params, sort: "price-asc" }).toString()}`}
              className={`px-3 py-1.5 rounded-lg border ${sort === "price-asc" ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/search?${new URLSearchParams({ ...params, sort: "price-desc" }).toString()}`}
              className={`px-3 py-1.5 rounded-lg border ${sort === "price-desc" ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Filter & Sort Controls */}
      <SearchMobileControls
        categories={categories}
        currentParams={cleanParamsRecord}
        totalProducts={pagination.total}
      />

      {/* Main Grid with Desktop Sidebar Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters (hidden on mobile) */}
        <aside className="hidden md:block space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filters
              </span>
              <Link href="/search" className="text-xs text-indigo-600 hover:underline">
                Reset All
              </Link>
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Category</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link
                    href={`/search?${new URLSearchParams({ ...params, category: "" }).toString()}`}
                    className={`block py-1 px-2 rounded-md ${!categorySlug ? "bg-indigo-100/70 text-indigo-800 font-bold" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    All Categories
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/search?${new URLSearchParams({ ...params, category: c.slug }).toString()}`}
                      className={`block py-1 px-2 rounded-md ${categorySlug === c.slug ? "bg-indigo-100/70 text-indigo-800 font-bold" : "text-slate-600 hover:bg-slate-100"}`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Price Range</h4>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={minPrice || ""}
                  className="w-full px-2 py-1 rounded-md border border-slate-300 bg-white"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={maxPrice || ""}
                  className="w-full px-2 py-1 rounded-md border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Customer Rating</h4>
              <div className="space-y-1 text-xs">
                {[4, 3, 2, 1].map((r) => (
                  <Link
                    key={r}
                    href={`/search?${new URLSearchParams({ ...params, rating: String(r) }).toString()}`}
                    className={`block py-1 px-2 rounded-md ${minRating === r ? "bg-amber-100 text-amber-900 font-bold" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    {r} Stars & Up
                  </Link>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Availability</h4>
              <div className="space-y-1.5 text-xs">
                <Link
                  href={`/search?${new URLSearchParams({ ...params, inStock: inStockOnly ? "" : "true" }).toString()}`}
                  className={`block py-1 px-2 rounded-md ${inStockOnly ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {inStockOnly ? "✓ In Stock Only" : "In Stock Only"}
                </Link>
                <Link
                  href={`/search?${new URLSearchParams({ ...params, onSale: onSaleOnly ? "" : "true" }).toString()}`}
                  className={`block py-1 px-2 rounded-md ${onSaleOnly ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {onSaleOnly ? "✓ On Sale Only" : "On Sale Only"}
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Results Grid (3 cols on desktop, 2 cols on mobile) */}
        <main className="md:col-span-3">
          {products.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50">
              <p className="text-base font-bold text-slate-700">No products matched your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords</p>
              <Link
                href="/search"
                className="mt-4 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8 sm:mt-12 flex-wrap">
              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === pagination.page;
                return (
                  <Link
                    key={pageNum}
                    href={`/search?${new URLSearchParams({ ...params, page: String(pageNum) }).toString()}`}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      isCurrent
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
