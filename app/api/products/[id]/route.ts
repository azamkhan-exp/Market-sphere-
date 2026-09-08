import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        brand: true,
        seller: {
          select: { id: true, storeName: true, slug: true, rating: true, reviewCount: true, logo: true, description: true },
        },
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await db.product.update({
      where: { id },
      data: {
        title: body.title,
        headline: body.headline,
        description: body.description,
        basePrice: body.basePrice !== undefined ? parseFloat(body.basePrice) : undefined,
        salePrice: body.salePrice !== undefined ? parseFloat(body.salePrice) : undefined,
        stockQuantity: body.stockQuantity !== undefined ? parseInt(body.stockQuantity) : undefined,
        status: body.status,
        categoryId: body.categoryId,
        tags: body.tags ? JSON.stringify(body.tags) : undefined,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
