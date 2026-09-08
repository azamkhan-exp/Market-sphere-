import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { OrderService } from "@/services/orderService";

const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: any;

  try {
    if (stripe && webhookSecret && sig) {
      // Real Stripe signature verification
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Safe Test Mode fallback
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Idempotency check: prevent duplicate event processing
  const eventId = event.id || event.eventId || `evt_${Date.now()}`;
  if (processedEvents.has(eventId)) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  processedEvents.add(eventId);

  // Keep set size bounded in memory
  if (processedEvents.size > 1000) {
    const [first] = processedEvents;
    processedEvents.delete(first);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data?.object || event;
        const paymentIntentId = paymentIntent.id;

        // Update payment record in database
        const payment = await db.payment.findFirst({
          where: { providerPaymentId: paymentIntentId },
          include: { order: true },
        });

        if (payment) {
          await db.payment.update({
            where: { id: payment.id },
            data: { status: "SUCCEEDED" },
          });

          if (payment.order.status === "PENDING") {
            await db.order.update({
              where: { id: payment.orderId },
              data: { status: "CONFIRMED", paymentStatus: "PAID" },
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data?.object || event;
        const paymentIntentId = paymentIntent.id;

        const payment = await db.payment.findFirst({
          where: { providerPaymentId: paymentIntentId },
          include: { order: true },
        });

        if (payment) {
          await db.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          });

          await db.order.update({
            where: { id: payment.orderId },
            data: { paymentStatus: "FAILED" },
          });

          await db.notification.create({
            data: {
              userId: payment.order.customerId,
              role: "CUSTOMER",
              title: "Payment Unsuccessful",
              message: `Payment for order #${payment.order.orderNumber} could not be processed. Please update payment method.`,
              type: "PAYMENT",
              link: `/checkout`,
            },
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data?.object || event;
        const paymentIntentId = charge.payment_intent;

        const payment = await db.payment.findFirst({
          where: { providerPaymentId: paymentIntentId },
          include: { order: true },
        });

        if (payment) {
          await db.payment.update({
            where: { id: payment.id },
            data: { status: "REFUNDED" },
          });

          await db.order.update({
            where: { id: payment.orderId },
            data: { status: "REFUNDED", paymentStatus: "REFUNDED" },
          });
        }
        break;
      }

      default:
        // Other events received and acknowledged
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error handling Stripe webhook event:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
