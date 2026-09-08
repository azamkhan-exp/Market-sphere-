import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/services/cartService";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.cookies.get("ms_session_id")?.value;
    const cart = await CartService.getOrCreateCart(session?.userId, sessionId);

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const updatedCart = await CartService.applyCoupon(cart.id, code);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to apply coupon" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.cookies.get("ms_session_id")?.value;
    const cart = await CartService.getOrCreateCart(session?.userId, sessionId);

    const updatedCart = await CartService.recalculateCart(cart.id);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to remove coupon" }, { status: 400 });
  }
}
