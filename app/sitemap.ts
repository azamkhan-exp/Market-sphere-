import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static Storefront Routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    // Dynamic Products
    const products = await db.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic Categories
    const categories = await db.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/search?category=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...routes, ...productRoutes, ...categoryRoutes];
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return routes;
  }
}
