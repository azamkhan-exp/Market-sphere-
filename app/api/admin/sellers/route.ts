import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellers = await db.seller.findMany({
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        verifications: true,
        _count: { select: { products: true, orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sellers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sellerId, status, commissionRate } = body;

    const updatedSeller = await db.seller.update({
      where: { id: sellerId },
      data: {
        status: status || undefined,
        commissionRate: commissionRate !== undefined ? parseFloat(commissionRate) : undefined,
      },
      include: { user: true },
    });

    // Create Audit Log
    await createAuditLog({
      actorId: session.userId,
      actorRole: "ADMIN",
      action: `SELLER_${status || "UPDATED"}`,
      entityType: "SELLER",
      entityId: sellerId,
      changesJson: JSON.stringify({ status, commissionRate }),
    });

    // Send in-app notification to seller
    await db.notification.create({
      data: {
        userId: updatedSeller.userId,
        role: "SELLER",
        title: `Seller Status Update: ${status}`,
        message: `Your seller profile has been updated to ${status}.`,
        type: "SYSTEM",
        link: "/seller/dashboard",
      },
    });

    return NextResponse.json({ success: true, seller: updatedSeller });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update seller" }, { status: 500 });
  }
}
