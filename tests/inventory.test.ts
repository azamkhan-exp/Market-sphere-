import { describe, it, expect } from "vitest";

describe("Order State Machine & Inventory Rules", () => {
  const allowedTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: [],
    REFUNDED: [],
  };

  function canTransition(current: string, next: string): boolean {
    return allowedTransitions[current]?.includes(next) ?? false;
  }

  it("permits standard order advancement flow", () => {
    expect(canTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransition("CONFIRMED", "PROCESSING")).toBe(true);
    expect(canTransition("PROCESSING", "SHIPPED")).toBe(true);
    expect(canTransition("SHIPPED", "OUT_FOR_DELIVERY")).toBe(true);
    expect(canTransition("OUT_FOR_DELIVERY", "DELIVERED")).toBe(true);
  });

  it("permits customer cancellation prior to shipment dispatch", () => {
    expect(canTransition("PENDING", "CANCELLED")).toBe(true);
    expect(canTransition("CONFIRMED", "CANCELLED")).toBe(true);
    expect(canTransition("PROCESSING", "CANCELLED")).toBe(true);
  });

  it("blocks direct cancellation once package is shipped or delivered", () => {
    expect(canTransition("SHIPPED", "CANCELLED")).toBe(false);
    expect(canTransition("OUT_FOR_DELIVERY", "CANCELLED")).toBe(false);
    expect(canTransition("DELIVERED", "CANCELLED")).toBe(false);
  });

  it("blocks transition from terminal states", () => {
    expect(canTransition("CANCELLED", "CONFIRMED")).toBe(false);
    expect(canTransition("REFUNDED", "SHIPPED")).toBe(false);
  });
});
