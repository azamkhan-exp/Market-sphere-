import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface ProductFilterParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  flashDealOnly?: boolean;
  sellerId?: string;
  sort?: "relevance" | "price-asc" | "price-desc" | "rating" | "newest" | "best-selling";
  page?: number;
  limit?: number;
}

export class ProductService {
  static async searchProducts(params: ProductFilterParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
    };

    if (params.query) {
      const q = params.query.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    if (params.category) {
      where.category = {
        OR: [{ slug: params.category }, { id: params.category }],
      };
    }

    if (params.brand) {
      where.brand = {
        OR: [{ slug: params.brand }, { id: params.brand }],
      };
    }

    if (params.sellerId) {
      where.sellerId = params.sellerId;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.salePrice = {
        gte: params.minPrice,
        lte: params.maxPrice,
      };
    }

    if (params.minRating !== undefined) {
      where.avgRating = { gte: params.minRating };
    }

    if (params.inStockOnly) {
      where.stockQuantity = { gt: 0 };
    }

    if (params.onSaleOnly) {
      where.salePrice = { not: null };
    }

    if (params.flashDealOnly) {
      where.isFlashDeal = true;
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (params.sort) {
      case "price-asc":
        orderBy = { salePrice: "asc" };
        break;
      case "price-desc":
        orderBy = { salePrice: "desc" };
        break;
      case "rating":
        orderBy = { avgRating: "desc" };
        break;
      case "best-selling":
        orderBy = { totalSales: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "relevance":
      default:
        orderBy = { totalSales: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          seller: { select: { id: true, storeName: true, rating: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductBySlug(slug: string) {
    return db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            rating: true,
            reviewCount: true,
            logo: true,
            description: true,
          },
        },
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        priceHistories: { orderBy: { createdAt: "desc" }, take: 1 },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  static async getFeaturedAndDeals() {
    const [flashDeals, bestSellers, newArrivals, categories] = await Promise.all([
      db.product.findMany({
        where: { status: "ACTIVE", isFlashDeal: true },
        include: { category: true, brand: true, images: true },
        take: 6,
      }),
      db.product.findMany({
        where: { status: "ACTIVE" },
        include: { category: true, brand: true, images: true },
        orderBy: { totalSales: "desc" },
        take: 8,
      }),
      db.product.findMany({
        where: { status: "ACTIVE" },
        include: { category: true, brand: true, images: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.category.findMany({
        where: { isFeatured: true },
        include: { _count: { select: { products: true } } },
        take: 8,
      }),
    ]);

    return { flashDeals, bestSellers, newArrivals, categories };
  }
}
