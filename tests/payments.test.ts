import { describe, it, expect } from "vitest";
import { PaymentService } from "../lib/stripe";

describe("Payment Provider & Safe Test Mode Simulator", () => {
  it("creates a valid payment intent with client secret in test mode", async () => {
    const result = await PaymentService.createIntent(149.99, "usd", { orderId: "ord_test_001" });

    expect(result).toBeDefined();
    expect(result.amount).toBe(149.99);
    expect(result.currency).toBe("usd");
    expect(result.paymentIntentId).toMatch(/^pi_/);
    expect(result.clientSecret).toBeDefined();
    expect(result.clientSecret.length).toBeGreaterThan(10);
  });

  it("confirms test mode payment intent with success status", async () => {
    const intent = await PaymentService.createIntent(89.5, "usd");
    const confirm = await PaymentService.confirmPayment(intent.paymentIntentId);

    expect(confirm.success).toBe(true);
    expect(confirm.status).toBe("succeeded");
    expect(confirm.paymentIntentId).toBe(intent.paymentIntentId);
  });

  it("processes refunds cleanly in test mode", async () => {
    const intent = await PaymentService.createIntent(50.0, "usd");
    const refund = await PaymentService.refundPayment(intent.paymentIntentId, 50.0, "customer_request");

    expect(refund.success).toBe(true);
    expect(refund.refundId).toMatch(/^re_/);
  });
});
