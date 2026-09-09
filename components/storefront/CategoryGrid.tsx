import * as React from "react";
import Link from "next/link";
import { ProductImage } from "../ui/ProductImage";
import { Cpu, Shirt, Home, Activity, Sparkles, Gamepad2, BookOpen, Wrench } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  electronics: <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
  fashion: <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />,
  "home-living": <Home className="w-5 h-5 sm:w-6 sm:h-6" />,
  "sports-fitness": <Activity className="w-5 h-5 sm:w-6 sm:h-6" />,
  "beauty-wellness": <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
  gaming: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />,
  "books-stationery": <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
  automotive: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />,
};

export interface CategoryGridProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    _count?: { products: number };
  }[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="my-8 sm:my-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Shop by Popular Categories</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Browse curated collections from verified vendors</p>
        </div>
        <Link href="/categories" className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline shrink-0">
          View all &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/search?category=${category.slug}`}
            className="group relative flex flex-col justify-end h-36 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-5 border border-slate-200 hover:shadow-lg transition-all duration-300"
          >
            <ProductImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 text-white">
              <div className="text-indigo-400 mb-1">
                {categoryIcons[category.slug] || <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </div>
              <h3 className="font-bold text-sm sm:text-base tracking-tight group-hover:text-indigo-300 transition-colors truncate">
                {category.name}
              </h3>
              {category._count?.products !== undefined && (
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">{category._count.products} products</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
