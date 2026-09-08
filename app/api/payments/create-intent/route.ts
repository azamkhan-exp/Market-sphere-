import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { CartService } from "@/services/cartService";
import { PaymentService } from "@/lib/stripe";
import { calculateOrderTotals } from "@/lib/currency";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.cookies.get("ms_session_id")?.value;
    const cart = await CartService.getOrCreateCart(session?.userId, sessionId);

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const shippingMethod = body.shippingMethod || "STANDARD";

    // Recalculate totals on server
    let subtotal = 0;
    for (const item of cart.items) {
      const price = item.variant?.price ?? item.product.salePrice ?? item.product.basePrice;
      subtotal += price * item.quantity;
    }

    let discountValue = 0;
    let discountType: "PERCENTAGE" | "FIXED" | undefined;

    if (cart.couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: cart.couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        discountValue = coupon.discountValue;
        discountType = coupon.discountType as "PERCENTAGE" | "FIXED";
      }
    }

    const totals = calculateOrderTotals({
      subtotal,
      discountValue,
      discountType,
      shippingMethod,
    });

    const paymentResult = await PaymentService.createIntent(totals.total, "usd", {
      cartId: cart.id,
      userId: session?.userId || "guest",
    });

    return NextResponse.json(paymentResult);
  } catch (error: any) {
    console.error("Payment Intent error:", error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
