import { MetadataRoute } from "next";
import { ProductRepository, CategoryRepository } from "@/repositories";

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
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
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
    const productsResult = await ProductRepository.findMany({ limit: 50 });
    const productRoutes: MetadataRoute.Sitemap = productsResult.products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic Categories
    const categories = await CategoryRepository.getAll();
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/search?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...routes, ...productRoutes, ...categoryRoutes];
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return routes;
  }
}
