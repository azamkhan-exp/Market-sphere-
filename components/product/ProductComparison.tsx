"use client";

import * as React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/storefront/StarRating";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, ShoppingCart, Check, ShieldCheck, Truck, Plus, Sparkles } from "lucide-react";

export interface ComparisonProduct {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  avgRating: number;
  reviewCount: number;
  stockQuantity: number;
  specifications: string;
  category?: { name: string; slug: string };
  brand?: { name: string; slug: string } | null;
  seller?: { storeName: string; rating: number };
  images?: { url: string }[];
}

export function ProductComparison({ initialProducts }: { initialProducts: ComparisonProduct[] }) {
  const [products, setProducts] = React.useState<ComparisonProduct[]>(initialProducts);
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleRemove = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingId(productId);
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        setAddedId(productId);
        setTimeout(() => setAddedId(null), 2000);
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingId(null);
    }
  };

  // Collect all unique specification keys across products
  const allSpecKeys = React.useMemo(() => {
    const keys = new Set<string>();
    products.forEach((p) => {
      try {
        const parsed = typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications;
        if (parsed && typeof parsed === "object") {
          Object.keys(parsed).forEach((k) => keys.add(k));
        }
      } catch {}
    });
    return Array.from(keys);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Products Selected to Compare</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Browse the catalog and click &ldquo;Compare&rdquo; on products you&apos;re considering to evaluate specifications, pricing, and ratings side-by-side.
        </p>
        <Link href="/search">
          <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
            Browse Catalog &rarr;
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Comparison</h1>
          <p className="text-xs text-slate-500 mt-1">
            Comparing {products.length} product{products.length > 1 ? "s" : ""} side-by-side
          </p>
        </div>
        <Link href="/search">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Plus className="w-4 h-4" /> Add Another Product
          </Button>
        </Link>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 w-48 shrink-0 font-bold text-slate-500 uppercase">Feature / Spec</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 min-w-[240px] max-w-[280px] align-top bg-white border-l border-slate-200">
                    <div className="relative space-y-3">
                      <button
                        onClick={() => handleRemove(p.id)}
                        title="Remove from comparison"
                        className="absolute -top-1 -right-1 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                        <ProductImage src={p.images?.[0]?.url} alt={p.title} fill />
                      </div>

                      <div>
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-2 transition-colors"
                        >
                          {p.title}
                        </Link>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-slate-900">
                            {formatPrice(p.salePrice ?? p.basePrice)}
                          </span>
                          {p.salePrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatPrice(p.basePrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(p.id)}
                        disabled={p.stockQuantity <= 0 || addingId === p.id}
                        className={`w-full gap-2 text-xs font-bold ${
                          addedId === p.id
                            ? "bg-emerald-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        {addedId === p.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Rating */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/60">Customer Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-center gap-2">
                      <StarRating rating={p.avgRating} size="sm" />
                      <span className="text-[11px] text-slate-500 font-semibold">({p.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Brand & Category */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/60">Brand & Category</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-slate-200">
                    <p className="font-bold text-slate-900">{p.brand?.name || "MarketSphere Direct"}</p>
                    <p className="text-[11px] text-slate-400">{p.category?.name}</p>
                  </td>
                ))}
              </tr>

              {/* Availability & Stock */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/60">Availability</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-slate-200">
                    {p.stockQuantity > 0 ? (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800">
                        In Stock ({p.stockQuantity} available)
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        Out of Stock
                      </Badge>
                    )}
                  </td>
                ))}
              </tr>

              {/* Verified Seller */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/60">Sold By (Vendor)</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p.seller?.storeName || "Verified Vendor"}</span>
                    </div>
                    {p.seller?.rating && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Seller Rating: {p.seller.rating} ★</p>
                    )}
                  </td>
                ))}
              </tr>

              {/* Shipping */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/60">Delivery & Shipping</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Free on orders over $100</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Express & Overnight delivery available</p>
                  </td>
                ))}
              </tr>

              {/* Dynamic Technical Specifications */}
              {allSpecKeys.map((key) => (
                <tr key={key} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/60 capitalize">{key}</td>
                  {products.map((p) => {
                    let specVal = "—";
                    try {
                      const parsed = typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications;
                      if (parsed && parsed[key]) specVal = String(parsed[key]);
                    } catch {}

                    return (
                      <td key={p.id} className="p-4 border-l border-slate-200 text-slate-700 font-normal">
                        {specVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
