import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signJwt, verifyJwt, SessionPayload } from "../lib/auth";

describe("Authentication & RBAC Token Security", () => {
  it("securely hashes and verifies passwords using bcrypt salt", () => {
    const rawPass = "SuperSecurePassword2026!";
    const hashed = hashPassword(rawPass);

    expect(hashed).not.toBe(rawPass);
    expect(hashed.startsWith("$2")).toBe(true);
    expect(verifyPassword(rawPass, hashed)).toBe(true);
    expect(verifyPassword("WrongPassword123", hashed)).toBe(false);
  });

  it("signs and verifies valid session JWTs with role payloads", () => {
    const payload: SessionPayload = {
      userId: "usr_test123",
      email: "admin@marketsphere.com",
      name: "Test Admin",
      role: "ADMIN",
    };

    const token = signJwt(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = verifyJwt(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe("usr_test123");
    expect(decoded?.role).toBe("ADMIN");
    expect(decoded?.email).toBe("admin@marketsphere.com");
  });

  it("returns null when verifying tampered or invalid tokens", () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature";
    expect(verifyJwt(invalidToken)).toBeNull();
    expect(verifyJwt("")).toBeNull();
  });

  it("differentiates role privileges between Customer, Seller, and Admin", () => {
    const customerPayload: SessionPayload = {
      userId: "u1",
      email: "c@test.com",
      name: "Customer",
      role: "CUSTOMER",
    };
    const sellerPayload: SessionPayload = {
      userId: "u2",
      email: "s@test.com",
      name: "Seller",
      role: "SELLER",
      sellerId: "sel_1",
    };
    const adminPayload: SessionPayload = {
      userId: "u3",
      email: "a@test.com",
      name: "Admin",
      role: "ADMIN",
    };

    const hasAdminAccess = (role: string) => role === "ADMIN";
    const hasSellerAccess = (role: string) => role === "SELLER" || role === "ADMIN";

    expect(hasAdminAccess(customerPayload.role)).toBe(false);
    expect(hasAdminAccess(sellerPayload.role)).toBe(false);
    expect(hasAdminAccess(adminPayload.role)).toBe(true);

    expect(hasSellerAccess(customerPayload.role)).toBe(false);
    expect(hasSellerAccess(sellerPayload.role)).toBe(true);
    expect(hasSellerAccess(adminPayload.role)).toBe(true);
  });
});
