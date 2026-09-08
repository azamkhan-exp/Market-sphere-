import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/wishlist");

  // Fetch or create wishlist
  let wishlist = await db.wishlist.findFirst({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true, category: true },
          },
        },
      },
    },
  });

  // If no items in user wishlist yet, show popular picks as starter
  const samplePicks = await db.product.findMany({
    where: { status: "ACTIVE" },
    include: { images: true, category: true },
    take: 4,
  });

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Your Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Saved favorites with real-time price monitoring and stock updates
          </p>
        </div>
      </div>

      {wishlist && wishlist.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.items.map((item) => (
            <ProductCard key={item.id} product={item.product as any} />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 space-y-2">
            <Heart className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Your wishlist is currently empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save items you love by clicking the heart icon on any product card while browsing.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4">Trending Recommendations for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {samplePicks.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
