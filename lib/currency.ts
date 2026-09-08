export interface CalculationInput {
  subtotal: number;
  discountValue?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  shippingMethod?: "STANDARD" | "EXPRESS" | "OVERNIGHT";
  taxRate?: number; // e.g. 0.08 for 8%
}

export interface CalculationResult {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
}

export function calculateOrderTotals(input: CalculationInput): CalculationResult {
  const subtotal = Math.max(0, Number(input.subtotal.toFixed(2)));

  // 1. Calculate discount
  let discountAmount = 0;
  if (input.discountValue && input.discountValue > 0) {
    if (input.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * input.discountValue) / 100;
    } else {
      discountAmount = input.discountValue;
    }
  }
  // Discount cannot exceed subtotal
  discountAmount = Math.min(subtotal, Math.max(0, Number(discountAmount.toFixed(2))));

  const discountedSubtotal = subtotal - discountAmount;

  // 2. Shipping calculation
  let shippingFee = 0;
  if (input.shippingMethod === "OVERNIGHT") {
    shippingFee = 25.0;
  } else if (input.shippingMethod === "EXPRESS") {
    shippingFee = 15.0;
  } else {
    // STANDARD shipping: free if discounted subtotal >= $100, otherwise $9.99
    shippingFee = discountedSubtotal >= 100.0 ? 0.0 : 9.99;
  }
  shippingFee = Number(shippingFee.toFixed(2));

  // 3. Tax calculation (standard 8.25% if not provided)
  const taxRate = input.taxRate !== undefined ? input.taxRate : 0.0825;
  const taxAmount = Number((discountedSubtotal * taxRate).toFixed(2));

  // 4. Grand Total
  const total = Number((discountedSubtotal + shippingFee + taxAmount).toFixed(2));

  return {
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    total,
  };
}
