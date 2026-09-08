import { notFound } from "next/navigation";
import { ProductService } from "@/services/productService";
import { db } from "@/lib/db";
import { ProductDetailClient } from "./ProductDetailClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | MarketSphere" };

  return {
    title: `${product.title} | MarketSphere`,
    description: product.headline || product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | MarketSphere`,
      description: product.headline || product.description.slice(0, 160),
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products in the same category
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "ACTIVE",
    },
    include: { images: true, category: true },
    take: 4,
  });

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.salePrice ?? product.basePrice,
      availability:
        product.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.seller.storeName,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.avgRating,
      reviewCount: Math.max(1, product.reviewCount),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />
    </>
  );
}
