import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await db.seller.findUnique({ where: { userId: session.userId } });
    const sellerId = seller ? seller.id : (await db.seller.findFirst())?.id!;

    const orderItems = await db.orderItem.findMany({
      where: { sellerId },
      include: {
        order: true,
        product: { include: { images: { take: 1 } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orderItems });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch seller orders" }, { status: 500 });
  }
}
