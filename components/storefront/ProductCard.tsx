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

  const imageUrl =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

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
    <div className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
      <div>
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50">
          <ProductImage
            src={product.images?.[0]?.url}
            alt={product.title}
            fill
            className="group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isFlashDeal && (
              <Badge variant="destructive" className="bg-red-500 text-white shadow-sm font-semibold">
                ⚡ Flash Deal
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="success" className="bg-emerald-600 text-white shadow-sm">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white shadow-sm transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // trigger wishlist event
              window.dispatchEvent(new CustomEvent("toast-message", { detail: "Saved to your Wishlist!" }));
            }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </Link>

        {/* Content Details */}
        <div className="p-4">
          {product.category && (
            <span className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-1 block">
              {product.category.name}
            </span>
          )}

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-2 flex items-center">
            <StarRating rating={product.avgRating} reviewCount={product.reviewCount} size="sm" />
          </div>
        </div>
      </div>

      {/* Price & Quick Add */}
      <div className="p-4 pt-0 border-t border-slate-50 mt-2">
        <div className="flex items-baseline justify-between mb-3 pt-2">
          <div>
            <span className="text-lg font-bold text-slate-900">{formatPrice(currentPrice)}</span>
            {hasDiscount && (
              <span className="ml-2 text-xs text-slate-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <span className="text-xs text-amber-600 font-medium">Only {product.stockQuantity} left!</span>
          )}
          {product.stockQuantity === 0 && (
            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={product.stockQuantity === 0 || isAdding}
          className={`w-full h-9 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Quick Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
