import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();

    const order = await db.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
            seller: { select: { id: true, storeName: true, slug: true } },
          },
        },
        shipments: { orderBy: { createdAt: "desc" } },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Permission check
    if (session && session.role !== "ADMIN" && order.customerId !== session.userId) {
      // Check if user is a seller for items in this order
      const isSeller = order.items.some((i) => i.sellerId === session.sellerId);
      if (!isSeller) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
