"use client";

import * as React from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = React.useState<any>(null);
  const [couponInput, setCouponInput] = React.useState("");
  const [applyingCoupon, setApplyingCoupon] = React.useState(false);
  const [couponError, setCouponError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const fetchCart = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQty = async (itemId: string, newQty: number) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.cart);
        setCouponInput("");
      } else {
        setCouponError(data.error || "Failed to apply coupon");
      }
    } catch (err) {
      setCouponError("Network error");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const res = await fetch("/api/cart/coupon", { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Loading your shopping cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Discover curated electronics, fashion, and home essentials.
        </p>
        <Link href="/search">
          <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
            Start Shopping &rarr;
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
        <p className="text-xs text-slate-500 mt-1">
          {cart.items.reduce((acc: number, i: any) => acc + i.quantity, 0)} item(s) in your basket
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {cart.items.map((item: any) => {
              const currentPrice = item.variant?.price ?? item.product.salePrice ?? item.product.basePrice;
              const imageUrl =
                item.product.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

              return (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Image & Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200">
                      <ProductImage src={item.product.images?.[0]?.url} alt={item.product.title} fill />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {item.product.title}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-slate-500 mt-0.5">Option: {item.variant.name}</p>
                      )}
                      <p className="text-xs font-bold text-slate-900 mt-1">{formatPrice(currentPrice)}</p>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    {/* Counter */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-l-lg text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-r-lg text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <span className="text-sm font-extrabold text-slate-900 min-w-[70px] text-right">
                      {formatPrice(currentPrice * item.quantity)}
                    </span>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs">
            <Link href="/search" className="font-semibold text-indigo-600 hover:underline">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({cart.couponCode})</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-900">
                  {cart.shipping === 0 ? "FREE" : formatPrice(cart.shipping)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8.25%)</span>
                <span className="font-bold text-slate-900">{formatPrice(cart.tax)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Order Total</span>
                <span className="text-indigo-600 text-base">{formatPrice(cart.total)}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-3 border-t border-slate-200">
              {cart.couponCode ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5" /> Code &quot;{cart.couponCode}&quot; applied!
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[11px] underline hover:text-red-600 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Apply Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-600"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      isLoading={applyingCoupon}
                      className="h-9 px-3 text-xs font-bold"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>}
                </form>
              )}
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md gap-2 mt-4"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
