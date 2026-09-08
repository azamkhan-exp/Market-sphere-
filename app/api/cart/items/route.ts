import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/services/cartService";
import { getSession } from "@/lib/auth";
import { CartItemSchema } from "@/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.cookies.get("ms_session_id")?.value || "anon_" + (req.headers.get("x-forwarded-for") || "guest");
    const cart = await CartService.getOrCreateCart(session?.userId, sessionId);

    const body = await req.json();
    const result = CartItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
    }

    const { productId, variantId, quantity } = result.data;
    const updatedCart = await CartService.addItem(cart.id, productId, variantId ?? undefined, quantity);

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add to cart" }, { status: 400 });
  }
}
