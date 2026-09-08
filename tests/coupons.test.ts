import { describe, it, expect } from "vitest";

interface Coupon {
  code: string;
  isActive: boolean;
  minOrderAmount: number;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  usageLimit: number;
  timesUsed: number;
  endDate?: Date;
}

function validateCoupon(coupon: Coupon, cartSubtotal: number): { valid: boolean; error?: string } {
  if (!coupon.isActive) {
    return { valid: false, error: "Coupon is inactive" };
  }
  if (coupon.endDate && coupon.endDate < new Date()) {
    return { valid: false, error: "Coupon has expired" };
  }
  if (coupon.timesUsed >= coupon.usageLimit) {
    return { valid: false, error: "Coupon redemption limit reached" };
  }
  if (cartSubtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order amount of $${coupon.minOrderAmount} required`,
    };
  }
  return { valid: true };
}

describe("Coupon Validation Business Logic", () => {
  const activeCoupon: Coupon = {
    code: "WELCOME10",
    isActive: true,
    minOrderAmount: 50,
    discountType: "PERCENTAGE",
    discountValue: 10,
    usageLimit: 100,
    timesUsed: 10,
  };

  it("approves valid coupon meeting minimum order spend", () => {
    const res = validateCoupon(activeCoupon, 80);
    expect(res.valid).toBe(true);
  });

  it("rejects coupon if cart subtotal is less than minimum order amount", () => {
    const res = validateCoupon(activeCoupon, 40);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Minimum order amount");
  });

  it("rejects inactive coupon", () => {
    const inactive = { ...activeCoupon, isActive: false };
    const res = validateCoupon(inactive, 100);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Coupon is inactive");
  });

  it("rejects expired coupon", () => {
    const expired = { ...activeCoupon, endDate: new Date("2020-01-01") };
    const res = validateCoupon(expired, 100);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Coupon has expired");
  });

  it("rejects coupon when usageLimit has been reached", () => {
    const exhausted = { ...activeCoupon, timesUsed: 100, usageLimit: 100 };
    const res = validateCoupon(exhausted, 100);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Coupon redemption limit reached");
  });
});
