import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { OrderRepository } from "@/repositories";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session && !isDemoMode()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session && isDemoMode()) {
      const orders = await OrderRepository.getAll();
      return NextResponse.json({ orders });
    }

    const where = session?.role === "ADMIN" ? {} : { customerId: session?.userId };
    let orders: any[] = [];

    if (!isDemoMode()) {
      orders = await db.order.findMany({
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
    } else {
      orders = session?.role === "ADMIN"
        ? await OrderRepository.getAll()
        : await OrderRepository.findByUserId(session?.userId || "usr_customer_01");
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
