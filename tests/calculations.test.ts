import { describe, it, expect } from "vitest";
import { calculateOrderTotals } from "../lib/currency";

describe("Pricing and Totals Calculation Engine", () => {
  it("calculates basic order total without discount or shipping fee above threshold", () => {
    const result = calculateOrderTotals({
      subtotal: 150.0,
      shippingMethod: "STANDARD",
      taxRate: 0.08,
    });

    expect(result.subtotal).toBe(150.0);
    expect(result.discountAmount).toBe(0);
    expect(result.shippingFee).toBe(0); // Free shipping for >= $100
    expect(result.taxAmount).toBe(12.0); // 150 * 0.08
    expect(result.total).toBe(162.0); // 150 + 12
  });

  it("applies standard shipping fee for orders under $100", () => {
    const result = calculateOrderTotals({
      subtotal: 50.0,
      shippingMethod: "STANDARD",
      taxRate: 0.1,
    });

    expect(result.shippingFee).toBe(9.99);
    expect(result.taxAmount).toBe(5.0); // 50 * 0.1
    expect(result.total).toBe(64.99); // 50 + 9.99 + 5.0
  });

  it("correctly computes percentage discount and recalculates tax on discounted subtotal", () => {
    const result = calculateOrderTotals({
      subtotal: 200.0,
      discountType: "PERCENTAGE",
      discountValue: 20, // 20% off
      shippingMethod: "STANDARD",
      taxRate: 0.1,
    });

    expect(result.discountAmount).toBe(40.0);
    expect(result.shippingFee).toBe(0); // 160 >= 100
    expect(result.taxAmount).toBe(16.0); // (200 - 40) * 0.1 = 16
    expect(result.total).toBe(176.0); // 160 + 0 + 16
  });

  it("computes fixed discounts properly and ensures discount does not exceed subtotal", () => {
    const result = calculateOrderTotals({
      subtotal: 40.0,
      discountType: "FIXED",
      discountValue: 50.0, // More than subtotal
      shippingMethod: "STANDARD",
      taxRate: 0.08,
    });

    expect(result.discountAmount).toBe(40.0); // Capped at subtotal
    expect(result.taxAmount).toBe(0);
    expect(result.shippingFee).toBe(9.99);
    expect(result.total).toBe(9.99);
  });

  it("charges designated fees for express and overnight shipping methods", () => {
    const express = calculateOrderTotals({
      subtotal: 200.0,
      shippingMethod: "EXPRESS",
      taxRate: 0,
    });
    expect(express.shippingFee).toBe(15.0);

    const overnight = calculateOrderTotals({
      subtotal: 200.0,
      shippingMethod: "OVERNIGHT",
      taxRate: 0,
    });
    expect(overnight.shippingFee).toBe(25.0);
  });
});
