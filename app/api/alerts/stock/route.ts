import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to set stock alerts" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const alert = await db.stockAlert.upsert({
      where: {
        userId_productId: {
          userId: session.userId,
          productId,
        },
      },
      update: { isNotified: false },
      create: {
        userId: session.userId,
        productId,
        isNotified: false,
      },
    });

    return NextResponse.json({ success: true, message: "We'll notify you when this item is restocked!", alert });
  } catch (error: any) {
    console.error("Stock alert error:", error);
    return NextResponse.json({ error: error.message || "Failed to create alert" }, { status: 500 });
  }
}
