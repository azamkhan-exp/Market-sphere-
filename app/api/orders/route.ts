import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = session.role === "ADMIN" ? {} : { customerId: session.userId };

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
            seller: { select: { storeName: true, slug: true } },
          },
        },
        shipments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
