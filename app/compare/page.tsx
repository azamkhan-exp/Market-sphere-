import { db } from "@/lib/db";
import { ProductComparison } from "@/components/product/ProductComparison";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const params = await searchParams;
  const rawIds = params.ids?.split(",").filter(Boolean) || [];

  let products: any[] = [];

  if (rawIds.length > 0) {
    products = await db.product.findMany({
      where: { id: { in: rawIds } },
      include: {
        category: true,
        brand: true,
        seller: { select: { storeName: true, rating: true } },
        images: { take: 1 },
      },
    });
  } else {
    // Default demo comparison: 2-3 top featured electronics/laptops/headphones
    products = await db.product.findMany({
      where: { isFeatured: true },
      include: {
        category: true,
        brand: true,
        seller: { select: { storeName: true, rating: true } },
        images: { take: 1 },
      },
      take: 3,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductComparison initialProducts={products} />
    </div>
  );
}
