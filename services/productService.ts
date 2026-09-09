import { db } from "@/lib/db";
import { isDatabaseEnabled } from "@/lib/config";
import { ProductRepository } from "@/repositories";
import { ProductFilterParams } from "@/repositories/types";

export { type ProductFilterParams };

export class ProductService {
  static async searchProducts(params: ProductFilterParams) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findMany(params);
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = { status: "ACTIVE" };

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

    let orderBy: any = [{ createdAt: "desc" }];
    switch (params.sort) {
      case "price-asc":
        orderBy = [{ salePrice: "asc" }, { basePrice: "asc" }];
        break;
      case "price-desc":
        orderBy = [{ salePrice: "desc" }, { basePrice: "desc" }];
        break;
      case "rating":
        orderBy = [{ avgRating: "desc" }];
        break;
      case "best-selling":
        orderBy = [{ totalSales: "desc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }];
        break;
      default:
        orderBy = [{ totalSales: "desc" }, { avgRating: "desc" }];
        break;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          seller: { select: { id: true, storeName: true, slug: true, rating: true } },
          images: { orderBy: { isPrimary: "desc" } },
        },
      }),
      db.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const pagination = {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    };

    return {
      products,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
      pagination,
    };
  }

  static async getProductBySlug(slug: string) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findBySlug(slug);
    }

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
            logo: true,
            rating: true,
            reviewCount: true,
          },
        },
        images: { orderBy: { isPrimary: "desc" } },
        variants: true,
        attributes: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });
  }

  static async getProductById(id: string) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findById(id);
    }

    return db.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        seller: true,
        images: true,
        variants: true,
        attributes: true,
      },
    });
  }

  static async getFeaturedProducts(limit = 8) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findFeatured(limit);
    }

    return db.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      take: limit,
      include: {
        category: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { totalSales: "desc" },
    });
  }

  static async getFlashDeals(limit = 4) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findFlashDeals(limit);
    }

    return db.product.findMany({
      where: { status: "ACTIVE", isFlashDeal: true },
      take: limit,
      include: {
        category: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getBestSellers(limit = 8) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findBestSellers(limit);
    }

    return db.product.findMany({
      where: { status: "ACTIVE" },
      take: limit,
      include: {
        category: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { totalSales: "desc" },
    });
  }

  static async getNewArrivals(limit = 8) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findNewArrivals(limit);
    }

    return db.product.findMany({
      where: { status: "ACTIVE" },
      take: limit,
      include: {
        category: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
    if (!isDatabaseEnabled()) {
      return ProductRepository.findRelated(categoryId, excludeProductId, limit);
    }

    return db.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        status: "ACTIVE",
      },
      take: limit,
      include: {
        category: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { totalSales: "desc" },
    });
  }
}
