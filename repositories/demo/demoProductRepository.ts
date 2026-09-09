import { DEMO_PRODUCTS } from "./demoData";
import { ProductFilterParams, ProductItem, ProductSearchResult } from "../types";

let inMemoryProducts = [...DEMO_PRODUCTS];

export class DemoProductRepository {
  static async findMany(params: ProductFilterParams = {}): Promise<ProductSearchResult> {
    let filtered = [...inMemoryProducts];

    // Status filter (default to active for storefront unless specified)
    filtered = filtered.filter((p) => p.status === "ACTIVE");

    // Search query
    if (params.query) {
      const q = params.query.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.tags && p.tags.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (params.category) {
      const cat = params.category.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.categoryId.toLowerCase() === cat ||
          p.category?.slug.toLowerCase() === cat ||
          p.category?.name.toLowerCase() === cat
      );
    }

    // Brand filter
    if (params.brand) {
      const brand = params.brand.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.brandId && p.brandId.toLowerCase() === brand) ||
          (p.brand && p.brand.slug.toLowerCase() === brand) ||
          (p.brand && p.brand.name.toLowerCase() === brand)
      );
    }

    // Seller filter
    if (params.sellerId) {
      filtered = filtered.filter((p) => p.sellerId === params.sellerId);
    }

    // Price range
    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => (p.salePrice ?? p.basePrice) >= (params.minPrice as number));
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => (p.salePrice ?? p.basePrice) <= (params.maxPrice as number));
    }

    // Rating
    if (params.minRating !== undefined) {
      filtered = filtered.filter((p) => p.avgRating >= (params.minRating as number));
    }

    // In stock only
    if (params.inStockOnly) {
      filtered = filtered.filter((p) => p.stockQuantity - p.reservedQuantity > 0);
    }

    // Flash deals only
    if (params.flashDealOnly) {
      filtered = filtered.filter((p) => p.isFlashDeal);
    }

    // On sale only
    if (params.onSaleOnly) {
      filtered = filtered.filter((p) => p.salePrice !== null && p.salePrice !== undefined && p.salePrice < p.basePrice);
    }

    // Sorting
    switch (params.sort) {
      case "price-asc":
        filtered.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
        break;
      case "rating":
        filtered.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "best-selling":
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case "newest":
      default:
        // default sorting by total sales then rating
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
    }

    // Pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const pagination = {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    };

    return {
      products: paginated,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
      pagination,
    };
  }

  static async findBySlug(slug: string): Promise<ProductItem | null> {
    const product = inMemoryProducts.find((p) => p.slug === slug);
    return product ? { ...product } : null;
  }

  static async findById(id: string): Promise<ProductItem | null> {
    const product = inMemoryProducts.find((p) => p.id === id);
    return product ? { ...product } : null;
  }

  static async findFeatured(limit = 8): Promise<ProductItem[]> {
    return inMemoryProducts.filter((p) => p.status === "ACTIVE" && p.isFeatured).slice(0, limit);
  }

  static async findFlashDeals(limit = 4): Promise<ProductItem[]> {
    return inMemoryProducts.filter((p) => p.status === "ACTIVE" && p.isFlashDeal).slice(0, limit);
  }

  static async findBestSellers(limit = 8): Promise<ProductItem[]> {
    return [...inMemoryProducts]
      .filter((p) => p.status === "ACTIVE")
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, limit);
  }

  static async findNewArrivals(limit = 8): Promise<ProductItem[]> {
    return [...inMemoryProducts]
      .filter((p) => p.status === "ACTIVE")
      .slice(0, limit);
  }

  static async findRelated(categoryId: string, excludeId: string, limit = 4): Promise<ProductItem[]> {
    return inMemoryProducts
      .filter((p) => p.status === "ACTIVE" && p.categoryId === categoryId && p.id !== excludeId)
      .slice(0, limit);
  }

  static async getAllForAdmin(): Promise<ProductItem[]> {
    return [...inMemoryProducts];
  }

  static async getBySeller(sellerId: string): Promise<ProductItem[]> {
    return inMemoryProducts.filter((p) => p.sellerId === sellerId);
  }

  static async create(data: Partial<ProductItem>): Promise<ProductItem> {
    const id = `prod_${Date.now()}`;
    const slug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `product-${Date.now()}`;
    const newProduct: ProductItem = {
      id,
      title: data.title || "Untitled Product",
      slug,
      headline: data.headline || null,
      description: data.description || "",
      sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
      basePrice: Number(data.basePrice) || 0,
      salePrice: data.salePrice ? Number(data.salePrice) : null,
      costPrice: data.costPrice ? Number(data.costPrice) : null,
      stockQuantity: Number(data.stockQuantity) || 0,
      reservedQuantity: 0,
      lowStockThreshold: Number(data.lowStockThreshold) || 5,
      status: data.status || "ACTIVE",
      isFeatured: Boolean(data.isFeatured),
      isFlashDeal: Boolean(data.isFlashDeal),
      avgRating: 5.0,
      reviewCount: 0,
      totalSales: 0,
      categoryId: data.categoryId || "cat_electronics",
      sellerId: data.sellerId || "sel_apex_01",
      tags: data.tags || "",
      images: data.images?.length
        ? data.images
        : [{ id: `img_${Date.now()}`, url: "/images/product-placeholder.svg", alt: data.title, isPrimary: true }],
      variants: data.variants || [],
      attributes: data.attributes || [],
    };

    inMemoryProducts.unshift(newProduct);
    return newProduct;
  }

  static async update(id: string, data: Partial<ProductItem>): Promise<ProductItem | null> {
    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...data };
    return inMemoryProducts[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const initialLen = inMemoryProducts.length;
    inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
    return inMemoryProducts.length < initialLen;
  }
}
