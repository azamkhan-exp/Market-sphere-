import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { CartService } from "@/services/cartService";
import { OrderService } from "@/services/orderService";
import { PaymentService } from "@/lib/stripe";
import { CheckoutSchema } from "@/validators";
import { DEMO_PRODUCTS } from "@/repositories/demo/demoData";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    // Allow demo checkout if session is absent but running in Demo Mode
    const userId = session?.userId || (isDemoMode() ? "usr_customer_01" : null);

    if (!userId) {
      return NextResponse.json({ error: "Please log in to complete checkout" }, { status: 401 });
    }

    const body = await req.json();
    const result = CheckoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid checkout information", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { shippingAddress, shippingMethod, couponCode, isGift, giftMessage, paymentIntentId } = result.data;

    // 1. Verify payment status with PaymentService (Safe Test Mode handles simulated intents)
    const paymentVerification = await PaymentService.confirmPayment(paymentIntentId);
    if (!paymentVerification.success) {
      return NextResponse.json(
        { error: "Payment verification failed: " + paymentVerification.error },
        { status: 402 }
      );
    }

    // 2. Fetch or create user's cart
    let cart: any = await CartService.getOrCreateCart(userId);

    // If cart is empty in demo mode, auto-populate with a demo item so checkout succeeds
    if ((!cart || !cart.items || cart.items.length === 0) && isDemoMode()) {
      const demoProd = DEMO_PRODUCTS[1]; // Apex Acoustic Horizon Headphones
      cart = await CartService.addItem(cart.id, demoProd.id, undefined, 1);
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 3. Create the order
    const order = await OrderService.createOrder({
      userId,
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
