import { DEMO_CATEGORIES } from "./demoData";
import { CategoryItem } from "../types";

let inMemoryCategories = [...DEMO_CATEGORIES];

export class DemoCategoryRepository {
  static async getAll(): Promise<CategoryItem[]> {
    return inMemoryCategories.map((c) => ({
      ...c,
      productCount: c.productCount || 8,
      _count: { products: c.productCount || 8 },
    }));
  }

  static async getFeatured(limit = 8): Promise<CategoryItem[]> {
    return inMemoryCategories
      .filter((c) => c.isFeatured)
      .slice(0, limit)
      .map((c) => ({
        ...c,
        productCount: c.productCount || 8,
        _count: { products: c.productCount || 8 },
      }));
  }

  static async getBySlug(slug: string): Promise<CategoryItem | null> {
    const cat = inMemoryCategories.find((c) => c.slug === slug || c.id === slug);
    return cat ? { ...cat, productCount: cat.productCount || 8, _count: { products: cat.productCount || 8 } } : null;
  }
}
