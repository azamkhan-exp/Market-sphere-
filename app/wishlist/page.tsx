import { getSession } from "@/lib/auth";
import { ProductRepository } from "@/repositories";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await getSession();

  // Curated demo wishlist items
  const samplePicks = await ProductRepository.findFeatured(4);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Your Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Saved favorites with real-time price monitoring and back-in-stock notifications
          </p>
        </div>

        {!session && (
          <div className="flex items-center gap-2 text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg">
            <span>Viewing guest wishlist</span>
            <Link href="/login?redirect=/wishlist" className="font-bold underline ml-1">
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Saved Items ({samplePicks.length})</h2>
          <Link href="/search" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {samplePicks.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
