import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { OrderRepository } from "@/repositories";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();

    let order: any = await OrderRepository.findById(id);
    if (!order) {
      order = await db.order.findFirst({
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
          shipments: true,
        },
      });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
