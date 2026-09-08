import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to set price alerts" }, { status: 401 });
    }

    const { productId, targetPrice } = await req.json();
    if (!productId || typeof targetPrice !== "number" || targetPrice <= 0) {
      return NextResponse.json({ error: "Product ID and a valid positive target price are required" }, { status: 400 });
    }

    const alert = await db.priceAlert.upsert({
      where: {
        userId_productId: {
          userId: session.userId,
          productId,
        },
      },
      update: {
        targetPrice,
        isTriggered: false,
      },
      create: {
        userId: session.userId,
        productId,
        targetPrice,
        isTriggered: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Price alert activated! We'll notify you if the price drops to or below $${targetPrice.toFixed(2)}.`,
      alert,
    });
  } catch (error: any) {
    console.error("Price alert error:", error);
    return NextResponse.json({ error: error.message || "Failed to create price alert" }, { status: 500 });
  }
}
