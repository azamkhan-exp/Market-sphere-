"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/ui/ProductImage";
import {
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  ShoppingCart,
  Store,
  MessageSquare,
  ThumbsUp,
  Bell,
  Scale,
  TrendingDown,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { StarRating } from "@/components/storefront/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProductCard } from "@/components/storefront/ProductCard";

export function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = React.useState(
    product.images?.[0]?.url || "/images/product-placeholder.svg"
  );
  const [selectedVariant, setSelectedVariant] = React.useState<any>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  const [addedNotice, setAddedNotice] = React.useState(false);

  // AI Review Summary state
  const [aiSummary, setAiSummary] = React.useState<any>(null);
  const [loadingAiSummary, setLoadingAiSummary] = React.useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewTitle, setReviewTitle] = React.useState("");
  const [reviewComment, setReviewComment] = React.useState("");
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [reviewSuccess, setReviewSuccess] = React.useState(false);

  // Alerts state
  const [stockAlertSubmitting, setStockAlertSubmitting] = React.useState(false);
  const [stockAlertSuccess, setStockAlertSuccess] = React.useState(false);
  const [isPriceAlertOpen, setIsPriceAlertOpen] = React.useState(false);
  const [targetPriceInput, setTargetPriceInput] = React.useState("");
  const [priceAlertSubmitting, setPriceAlertSubmitting] = React.useState(false);
  const [priceAlertSuccess, setPriceAlertSuccess] = React.useState(false);

  const currentPrice = selectedVariant?.price ?? product.salePrice ?? product.basePrice;
  const originalPrice = selectedVariant?.compareAtPrice ?? (product.salePrice ? product.basePrice : null);
  const isOutOfStock = (selectedVariant?.stockQuantity ?? product.stockQuantity) <= 0;

  // Fetch AI review summary on mount
  React.useEffect(() => {
    async function loadAiSummary() {
      try {
        setLoadingAiSummary(true);
        const res = await fetch(`/api/ai/summarize-reviews?productId=${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setAiSummary(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAiSummary(false);
      }
    }
    loadAiSummary();
  }, [product.id]);

  const handleAddToCart = async (redirectCheckout = false) => {
    try {
      setIsAdding(true);
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
          quantity,
        }),
      });

      if (res.ok) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        if (redirectCheckout) {
          router.push("/checkout");
        } else {
          setAddedNotice(true);
          setTimeout(() => setAddedNotice(false), 3000);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add to cart");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewSuccess(false);
          router.refresh();
        }, 1500);
      } else {
        const err = await res.json();
        alert(err.error || "Could not submit review");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleStockAlert = async () => {
    try {
      setStockAlertSubmitting(true);
      const res = await fetch("/api/alerts/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        setStockAlertSuccess(true);
        setTimeout(() => setStockAlertSuccess(false), 4000);
      } else if (res.status === 401) {
        router.push(`/login?redirect=/products/${product.slug}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStockAlertSubmitting(false);
    }
  };

  const handlePriceAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetPriceInput);
    if (isNaN(val) || val <= 0) return;

    try {
      setPriceAlertSubmitting(true);
      const res = await fetch("/api/alerts/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, targetPrice: val }),
      });
      if (res.ok) {
        setPriceAlertSuccess(true);
        setTimeout(() => {
          setIsPriceAlertOpen(false);
          setPriceAlertSuccess(false);
        }, 2000);
      } else if (res.status === 401) {
        router.push(`/login?redirect=/products/${product.slug}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPriceAlertSubmitting(false);
    }
  };

  let specs: Record<string, string> = {};
  try {
    specs = typeof product.specifications === "string" ? JSON.parse(product.specifications) : product.specifications;
  } catch (e) {
    specs = {};
  }

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 md:pb-0">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-indigo-600 shrink-0">Home</Link>
        <span>/</span>
        <Link href={`/search?category=${product.category?.slug}`} className="hover:text-indigo-600 shrink-0">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-[180px] sm:max-w-sm">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
            <ProductImage
              src={selectedImage}
              alt={product.title}
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img.url ? "border-indigo-600 shadow-md" : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <ProductImage src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {product.brand && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {product.brand.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 leading-snug">
              {product.title}
            </h1>
            {product.headline && (
              <p className="text-sm text-slate-600 mt-2">{product.headline}</p>
            )}

            {/* Ratings & SKU */}
            <div className="flex items-center gap-4 mt-3">
              <StarRating rating={product.avgRating} reviewCount={product.reviewCount} size="md" />
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500 font-mono">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">{formatPrice(currentPrice)}</span>
              {originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {originalPrice && (
                <Badge variant="success" className="bg-emerald-600 text-white font-bold">
                  Save {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                </Badge>
              )}
            </div>

            {/* Price Drop History Indicator */}
            {product.priceHistories && product.priceHistories.length > 0 && product.priceHistories[0].oldPrice > currentPrice && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Price dropped from {formatPrice(product.priceHistories[0].oldPrice)}</span>
              </div>
            )}
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Option:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedVariant?.id === v.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {v.name} ({formatPrice(v.price)})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTAs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l-xl text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r-xl text-sm font-bold"
                >
                  +
                </button>
              </div>

              <span className="text-xs font-medium">
                {isOutOfStock ? (
                  <span className="text-red-500 font-bold">Currently Out of Stock</span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> In Stock & Ready to Ship
                  </span>
                )}
              </span>
            </div>

            {isOutOfStock ? (
              <div className="space-y-3">
                <Button
                  onClick={handleStockAlert}
                  disabled={stockAlertSubmitting || stockAlertSuccess}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2 text-sm shadow-sm"
                >
                  <Bell className="w-4 h-4" />
                  {stockAlertSuccess
                    ? "✓ You will be notified when back in stock!"
                    : stockAlertSubmitting
                    ? "Subscribing..."
                    : "Notify Me When Back in Stock"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding}
                  className="flex-1 h-12 bg-slate-900 hover:bg-indigo-600 text-white font-bold gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" /> {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  onClick={() => handleAddToCart(true)}
                  disabled={isAdding}
                  className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md"
                >
                  Buy Now
                </Button>
              </div>
            )}

            {/* Secondary Action CTAs: Price Drop Alert & Product Comparison */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsPriceAlertOpen(true)}
                className="gap-1.5 text-xs text-slate-700 hover:text-indigo-600"
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" /> Set Price Alert
              </Button>
              <Link href={`/compare?ids=${product.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="gap-1.5 text-xs text-slate-700 hover:text-indigo-600"
                >
                  <Scale className="w-3.5 h-3.5 text-indigo-600" /> Compare Specs
                </Button>
              </Link>
            </div>

            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between">
                <span>Added {quantity} item(s) to your shopping cart!</span>
                <Link href="/cart" className="underline font-bold">View Cart</Link>
              </div>
            )}
          </div>

          {/* Seller Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Sold & Fulfilled by</p>
                <h4 className="text-sm font-bold text-slate-900">{product.seller.storeName}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>⭐ {product.seller.rating.toFixed(1)} Seller Rating</span>
                  <span>•</span>
                  <span>{product.seller.reviewCount} Reviews</span>
                </div>
              </div>
            </div>
            <Link
              href={`/search?sellerId=${product.seller.id}`}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Visit Store &rarr;
            </Link>
          </div>

          {/* Assurance Trust Bullets */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Fast Express Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-600" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>MarketSphere Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>100% Genuine Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Technical Specs */}
      <div className="border-t border-slate-200 pt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Product Description</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        <div className="md:col-span-5 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Technical Specifications</h2>
          {Object.keys(specs).length > 0 ? (
            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:p-3 bg-white even:bg-slate-50 text-xs gap-1">
                  <span className="font-semibold text-slate-600">{key}</span>
                  <span className="text-slate-900 font-mono break-all">{val}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Standard manufacturer specifications apply.</p>
          )}
        </div>
      </div>

      {/* AI Review Summarization Banner */}
      {aiSummary && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">AI Customer Sentiment Analysis</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold ml-2">
              Grounded in {aiSummary.totalAnalyzed} real reviews
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium mb-4">
            {aiSummary.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/80 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                ✓ What Customers Love
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {aiSummary.pros.map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-amber-100">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                ⚠ Considerations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {aiSummary.cons.map((c: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="border-t border-slate-200 pt-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews</h2>
            <p className="text-xs text-slate-500">Verified purchases from authentic buyers</p>
          </div>
          <Button
            onClick={() => setIsReviewModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((rev: any) => (
              <div key={rev.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700">
                      {rev.user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.user.name}</h4>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <StarRating rating={rev.rating} size="sm" showNumber={false} />
                  <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No reviews yet. Be the first to share your experience!</p>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-t border-slate-200 pt-10 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Similar Products You Might Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-slate-500 truncate">{product.title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-slate-900">{formatPrice(currentPrice)}</span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-[10px] text-slate-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>
        </div>

        {isOutOfStock ? (
          <Button
            onClick={handleStockAlert}
            disabled={stockAlertSubmitting || stockAlertSuccess}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 px-3 shrink-0"
          >
            {stockAlertSuccess ? "Subscribed" : "Notify When In Stock"}
          </Button>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              onClick={() => handleAddToCart(false)}
              disabled={isAdding}
              variant="outline"
              size="sm"
              className="text-xs font-bold h-9 px-3 border-slate-300"
            >
              Add
            </Button>
            <Button
              onClick={() => handleAddToCart(true)}
              disabled={isAdding}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-3.5 shadow-sm"
            >
              Buy Now
            </Button>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review "${product.title}"`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-amber-400 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">Review Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Exceptional build quality and battery life"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">Your Honest Review</label>
            <textarea
              required
              rows={4}
              placeholder="What did you like or dislike? How does it perform in real life?"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {reviewSuccess && (
            <p className="text-xs font-bold text-emerald-600">Review submitted successfully!</p>
          )}

          <Button
            type="submit"
            isLoading={submittingReview}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
          >
            Submit Verified Review
          </Button>
        </form>
      </Modal>

      {/* Price Alert Modal */}
      <Modal
        isOpen={isPriceAlertOpen}
        onClose={() => setIsPriceAlertOpen(false)}
        title="Set Price Drop Alert"
      >
        <form onSubmit={handlePriceAlert} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your target price for <span className="font-bold text-slate-900">{product.title}</span>. Current price is <span className="font-bold text-slate-900">{formatPrice(currentPrice)}</span>. We&apos;ll send you an in-app notification when the price reaches or falls below your target.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Target Price (USD $)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              max={currentPrice}
              required
              value={targetPriceInput}
              onChange={(e) => setTargetPriceInput(e.target.value)}
              placeholder={`e.g. ${(currentPrice * 0.9).toFixed(2)}`}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {priceAlertSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
              ✓ Alert created! We will notify you when price drops.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsPriceAlertOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              isLoading={priceAlertSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Activate Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
