import { describe, it, expect } from "vitest";
import {
  canTransitionOrder,
  validateOrderTransition,
  OrderStateMachineError,
  OrderStatus,
} from "../lib/orderStateMachine";

describe("Centralized Order State Machine", () => {
  it("allows standard progressive fulfillment flow", () => {
    expect(canTransitionOrder("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransitionOrder("CONFIRMED", "PROCESSING")).toBe(true);
    expect(canTransitionOrder("PROCESSING", "SHIPPED")).toBe(true);
    expect(canTransitionOrder("SHIPPED", "OUT_FOR_DELIVERY")).toBe(true);
    expect(canTransitionOrder("OUT_FOR_DELIVERY", "DELIVERED")).toBe(true);
  });

  it("allows cancellation during initial unfulfilled stages", () => {
    expect(canTransitionOrder("PENDING", "CANCELLED")).toBe(true);
    expect(canTransitionOrder("CONFIRMED", "CANCELLED")).toBe(true);
    expect(canTransitionOrder("PROCESSING", "CANCELLED")).toBe(true);
  });

  it("disallows cancellation once dispatched to carrier", () => {
    expect(canTransitionOrder("SHIPPED", "CANCELLED")).toBe(false);
    expect(canTransitionOrder("OUT_FOR_DELIVERY", "CANCELLED")).toBe(false);
    expect(canTransitionOrder("DELIVERED", "CANCELLED")).toBe(false);
  });

  it("allows refund from post-fulfillment states", () => {
    expect(canTransitionOrder("SHIPPED", "REFUNDED")).toBe(true);
    expect(canTransitionOrder("DELIVERED", "REFUNDED")).toBe(true);
  });

  it("strictly prevents invalid backwards transitions", () => {
    expect(canTransitionOrder("DELIVERED", "PROCESSING")).toBe(false);
    expect(canTransitionOrder("SHIPPED", "CONFIRMED")).toBe(false);
    expect(canTransitionOrder("CANCELLED", "CONFIRMED")).toBe(false);
    expect(canTransitionOrder("REFUNDED", "DELIVERED")).toBe(false);
  });

  it("throws OrderStateMachineError with descriptive message on invalid transition", () => {
    expect(() => validateOrderTransition("DELIVERED", "PROCESSING")).toThrowError(
      OrderStateMachineError
    );
    expect(() => validateOrderTransition("CANCELLED", "SHIPPED")).toThrowError(
      /Invalid order status transition from CANCELLED to SHIPPED/
    );
  });
});
