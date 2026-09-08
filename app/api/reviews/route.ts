import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReviewSchema } from "@/validators";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const reviews = await db.review.findMany({
      where: { productId, isApproved: true },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const body = await req.json();
    const result = ReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid review data", details: result.error.flatten() }, { status: 400 });
    }

    const { productId, rating, title, comment, images } = result.data;

    // Check verified purchase
    const pastPurchase = await db.orderItem.findFirst({
      where: {
        productId,
        order: {
          customerId: session.userId,
          paymentStatus: "PAID",
        },
      },
    });

    const isVerifiedPurchase = !!pastPurchase;

    // Prevent duplicate review
    const existing = await db.review.findFirst({
      where: { productId, userId: session.userId },
    });

    if (existing) {
      return NextResponse.json({ error: "You have already submitted a review for this product" }, { status: 409 });
    }

    const review = await db.review.create({
      data: {
        productId,
        userId: session.userId,
        rating,
        title,
        comment,
        isVerifiedPurchase,
        images: images && images.length > 0 ? {
          create: images.map((url) => ({ url })),
        } : undefined,
      },
      include: { user: true, images: true },
    });

    // Update product average rating and count
    const allReviews = await db.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await db.product.update({
      where: { id: productId },
      data: {
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}
