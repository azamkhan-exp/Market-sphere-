import { db } from "@/lib/db";

export class RecommendationService {
  /**
   * "Recommended for you" based on customer's top viewed categories and past order items
   */
  static async getPersonalizedRecommendations(userId?: string, limit = 8) {
    if (!userId) {
      // Fallback to top-selling and highly rated products
      return db.product.findMany({
        where: { status: "ACTIVE" },
        include: {
          category: true,
          brand: true,
          images: { take: 1 },
        },
        orderBy: [{ totalSales: "desc" }, { avgRating: "desc" }],
        take: limit,
      });
    }

    // 1. Get categories customer recently viewed or bought
    const recentViews = await db.recentlyViewed.findMany({
      where: { userId },
      include: { product: { select: { categoryId: true, brandId: true } } },
      orderBy: { viewedAt: "desc" },
      take: 10,
    });

    const categoryIds = Array.from(
      new Set(recentViews.map((rv) => rv.product.categoryId).filter(Boolean))
    );

    if (categoryIds.length === 0) {
      return db.product.findMany({
        where: { status: "ACTIVE" },
        include: {
          category: true,
          brand: true,
          images: { take: 1 },
        },
        orderBy: [{ totalSales: "desc" }, { avgRating: "desc" }],
        take: limit,
      });
    }

    return db.product.findMany({
      where: {
        status: "ACTIVE",
        categoryId: { in: categoryIds },
      },
      include: {
        category: true,
        brand: true,
        images: { take: 1 },
      },
      orderBy: [{ avgRating: "desc" }, { totalSales: "desc" }],
      take: limit,
    });
  }

  /**
   * "Customers also bought..." based on co-occurrence in orders
   */
  static async getCustomersAlsoBought(productId: string, limit = 4) {
    // Find other products that appear in the same orders as this product
    const orderItemsWithSameProduct = await db.orderItem.findMany({
      where: { productId },
      select: { orderId: true },
      take: 50,
    });

    const orderIds = orderItemsWithSameProduct.map((oi) => oi.orderId);

    if (orderIds.length > 0) {
      const coOccurring = await db.orderItem.findMany({
        where: {
          orderId: { in: orderIds },
          productId: { not: productId },
        },
        select: { productId: true },
        take: 20,
      });

      const coProductIds = Array.from(new Set(coOccurring.map((c) => c.productId)));

      if (coProductIds.length > 0) {
        const products = await db.product.findMany({
          where: {
            id: { in: coProductIds },
            status: "ACTIVE",
          },
          include: {
            category: true,
            brand: true,
            images: { take: 1 },
          },
          take: limit,
        });

        if (products.length >= 2) return products;
      }
    }

    // Fallback: Products in same category
    const currentProduct = await db.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    return db.product.findMany({
      where: {
        categoryId: currentProduct?.categoryId,
        id: { not: productId },
        status: "ACTIVE",
      },
      include: {
        category: true,
        brand: true,
        images: { take: 1 },
      },
      orderBy: { totalSales: "desc" },
      take: limit,
    });
  }
}
