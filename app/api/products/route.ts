import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/productService";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductSchema } from "@/validators";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const minRating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : undefined;
    const inStockOnly = searchParams.get("inStock") === "true";
    const onSaleOnly = searchParams.get("onSale") === "true";
    const flashDealOnly = searchParams.get("flashDeal") === "true";
    const sellerId = searchParams.get("sellerId") || undefined;
    const sort = (searchParams.get("sort") as any) || "relevance";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const data = await ProductService.searchProducts({
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly,
      onSaleOnly,
      flashDealOnly,
      sellerId,
      sort,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await db.seller.findUnique({ where: { userId: session.userId } });
    if (!seller && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Seller profile required" }, { status: 403 });
    }

    const sellerId = seller ? seller.id : (await db.seller.findFirst())?.id!;

    const body = await req.json();
    const result = ProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid product data", details: result.error.flatten() }, { status: 400 });
    }

    const data = result.data;
    const baseSlug = slugify(data.title);
    const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const product = await db.product.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        sku: data.sku,
        headline: data.headline,
        description: data.description,
        specifications: JSON.stringify(data.specifications),
        basePrice: data.basePrice,
        salePrice: data.salePrice,
        stockQuantity: data.stockQuantity,
        lowStockThreshold: data.lowStockThreshold,
        status: "ACTIVE",
        categoryId: data.categoryId,
        brandId: data.brandId,
        sellerId,
        tags: JSON.stringify(data.tags),
        images: {
          create: data.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
        inventories: {
          create: {
            quantityOnHand: data.stockQuantity,
            lowStockAlert: data.lowStockThreshold,
          },
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Product POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
