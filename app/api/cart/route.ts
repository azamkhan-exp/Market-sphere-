import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/services/cartService";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.cookies.get("ms_session_id")?.value || "anon_" + (req.headers.get("x-forwarded-for") || "guest");

    const cart = await CartService.getOrCreateCart(session?.userId, sessionId);
    return NextResponse.json({ cart });
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}
