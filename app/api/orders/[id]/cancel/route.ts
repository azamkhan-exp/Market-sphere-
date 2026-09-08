import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { OrderService } from "@/services/orderService";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const reason = body.reason || "Customer requested cancellation";

    const cancelledOrder = await OrderService.cancelOrder(id, session.userId, reason);
    return NextResponse.json({ success: true, order: cancelledOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to cancel order" }, { status: 400 });
  }
}
