import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sellerStatus, trackingNumber } = body;

    const item = await db.orderItem.update({
      where: { id },
      data: {
        sellerStatus: sellerStatus || undefined,
        trackingNumber: trackingNumber || undefined,
      },
      include: { order: true },
    });

    // If all items are shipped, update master order
    if (sellerStatus === "SHIPPED") {
      await db.order.update({
        where: { id: item.orderId },
        data: {
          status: "SHIPPED",
          trackingNumber: trackingNumber || item.order.trackingNumber,
        },
      });

      // Send in-app notification to customer
      await db.notification.create({
        data: {
          userId: item.order.customerId,
          role: "CUSTOMER",
          title: "Order Dispatched!",
          message: `Your item "${item.title}" has been marked shipped. Tracking: ${trackingNumber || "Available"}`,
          type: "ORDER",
          link: `/orders/${item.orderId}/track`,
        },
      });
    }

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update item status" }, { status: 500 });
  }
}
