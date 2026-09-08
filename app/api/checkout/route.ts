import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { CartService } from "@/services/cartService";
import { OrderService } from "@/services/orderService";
import { PaymentService } from "@/lib/stripe";
import { CheckoutSchema } from "@/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to complete checkout" }, { status: 401 });
    }

    const body = await req.json();
    const result = CheckoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid checkout information", details: result.error.flatten() }, { status: 400 });
    }

    const { shippingAddress, shippingMethod, couponCode, isGift, giftMessage, paymentIntentId } = result.data;

    // 1. Verify payment status with PaymentService
    const paymentVerification = await PaymentService.confirmPayment(paymentIntentId);
    if (!paymentVerification.success) {
      return NextResponse.json({ error: "Payment verification failed: " + paymentVerification.error }, { status: 402 });
    }

    // 2. Fetch user's cart
    const cart = await CartService.getOrCreateCart(session.userId);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 3. Create the order transactionally
    const order = await OrderService.createOrder({
      userId: session.userId,
      cartId: cart.id,
      shippingAddress,
      shippingMethod,
      couponCode: couponCode || cart.couponCode || undefined,
      isGift,
      giftMessage,
      paymentIntentId,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Failed to process checkout" }, { status: 500 });
  }
}
