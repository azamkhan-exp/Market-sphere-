import { CategoryRepository } from "@/repositories";
import Link from "next/link";
import Image from "next/image";
import {
  Laptop,
  Headphones,
  Home,
  Activity,
  Watch,
  Cpu,
  Monitor,
  Sparkles,
  ArrowRight,
  Package,
} from "lucide-react";

export const metadata = {
  title: "All Categories | MarketSphere",
  description: "Browse thousands of products across all categories from verified sellers on MarketSphere.",
};

const iconMap: Record<string, any> = {
  Laptop,
  Headphones,
  Home,
  Activity,
  Watch,
  Cpu,
  Monitor,
  Sparkles,
};

export default async function CategoriesPage() {
  const categories = await CategoryRepository.getAll();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 sm:pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Explore All Categories</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Discover verified products from premier independent merchants and authorized brands.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {categories.map((category) => {
          const IconComponent = (category.icon && iconMap[category.icon]) || Package;

          return (
            <Link
              key={category.id}
              href={`/search?category=${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-500">
                    <IconComponent className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm drop-shadow">{category.name}</span>
                  </div>
                  <span className="text-[11px] font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                    {category.productCount || 8}+ items
                  </span>
                </div>
              </div>

              {/* Description & Link */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {category.description || `Browse high-performance ${category.name.toLowerCase()} products.`}
                </p>

                <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Browse catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
