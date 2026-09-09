"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "./StarRating";
import { Badge } from "../ui/Badge";
import { ProductImage } from "../ui/ProductImage";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    headline?: string | null;
    basePrice: number;
    salePrice?: number | null;
    avgRating: number;
    reviewCount: number;
    stockQuantity: number;
    isFlashDeal?: boolean;
    category?: { name: string; slug: string };
    images?: { url: string; altText?: string | null }[];
  };
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);

  const currentPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (res.ok) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        if (onAddToCart) onAddToCart(product.id);
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
      <div>
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50">
          <ProductImage
            src={product.images?.[0]?.url}
            alt={product.title}
            fill
            className="group-hover:scale-105 transition-transform duration-500 object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
            {product.isFlashDeal && (
              <Badge variant="destructive" className="bg-red-500 text-white shadow-sm font-semibold text-[9px] sm:text-[10px] px-1.5 py-0.5">
                ⚡ Deal
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="success" className="bg-emerald-600 text-white shadow-sm text-[9px] sm:text-[10px] px-1.5 py-0.5">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button (touch-friendly) */}
          <button
            aria-label="Add to wishlist"
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white shadow-sm transition-colors min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent("toast-message", { detail: "Saved to your Wishlist!" }));
            }}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </Link>

        {/* Content Details */}
        <div className="p-2.5 sm:p-4">
          {product.category && (
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-1 block truncate">
              {product.category.name}
            </span>
          )}

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-1.5 sm:mt-2 flex items-center">
            <StarRating rating={product.avgRating} reviewCount={product.reviewCount} size="sm" />
          </div>
        </div>
      </div>

      {/* Price & Quick Add */}
      <div className="p-2.5 sm:p-4 pt-0 border-t border-slate-50 mt-1 sm:mt-2">
        <div className="flex flex-wrap items-baseline justify-between gap-1 mb-2 sm:mb-3 pt-1.5 sm:pt-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <span className="text-[10px] sm:text-xs text-amber-600 font-medium">Only {product.stockQuantity} left</span>
          )}
          {product.stockQuantity === 0 && (
            <span className="text-[10px] sm:text-xs text-red-500 font-medium">Out of Stock</span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={product.stockQuantity === 0 || isAdding}
          className={`w-full h-8 sm:h-9 rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Quick Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
