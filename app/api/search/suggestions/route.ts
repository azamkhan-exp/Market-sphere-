import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 2) {
      // Return popular categories and top products
      const popular = await db.product.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, title: true, slug: true, salePrice: true, basePrice: true },
        orderBy: { totalSales: "desc" },
        take: 5,
      });
      return NextResponse.json({
        suggestions: popular.map((p) => ({
          type: "product",
          title: p.title,
          url: `/products/${p.slug}`,
        })),
      });
    }

    const [products, categories] = await Promise.all([
      db.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [{ title: { contains: q } }, { tags: { contains: q } }],
        },
        select: { id: true, title: true, slug: true, salePrice: true, basePrice: true },
        take: 5,
      }),
      db.category.findMany({
        where: { name: { contains: q } },
        select: { id: true, name: true, slug: true },
        take: 3,
      }),
    ]);

    const suggestions = [
      ...categories.map((c) => ({
        type: "category",
        title: `Category: ${c.name}`,
        url: `/search?category=${c.slug}`,
      })),
      ...products.map((p) => ({
        type: "product",
        title: p.title,
        url: `/products/${p.slug}`,
      })),
    ];

    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ suggestions: [] });
  }
}
