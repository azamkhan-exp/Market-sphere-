import { describe, it, expect } from "vitest";
import { InventoryService } from "../services/inventoryService";

describe("Inventory Consistency & Available Stock Logic", () => {
  it("correctly calculates available stock taking reservations into account", () => {
    const product = {
      stockQuantity: 25,
      reservedQuantity: 5,
    };

    const available = InventoryService.getAvailableStock(product);
    expect(available).toBe(20);
  });

  it("prevents negative available stock if reservations equal or exceed on-hand", () => {
    const product = {
      stockQuantity: 10,
      reservedQuantity: 12, // edge condition
    };

    const available = InventoryService.getAvailableStock(product);
    expect(available).toBe(0);
  });

  it("returns full stock when there are no active reservations", () => {
    const product = {
      stockQuantity: 100,
      reservedQuantity: 0,
    };

    const available = InventoryService.getAvailableStock(product);
    expect(available).toBe(100);
  });
});
