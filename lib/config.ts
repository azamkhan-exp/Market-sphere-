/**
 * MarketSphere Platform Configuration & Execution Mode
 */

export function isDatabaseEnabled(): boolean {
  // If explicitly disabled via environment variable
  if (process.env.DATABASE_ENABLED === "false") {
    return false;
  }

  // If no DATABASE_URL is provided, or if it's empty / undefined
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl) {
    return false;
  }

  // In production / Vercel, unless explicitly set to true with a valid connection string, default to safe mode
  if (process.env.DATABASE_ENABLED === "true") {
    return true;
  }

  // If a valid non-empty postgresql/postgres/mysql URL is provided, enable DB
  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://") || dbUrl.startsWith("mysql://")) {
    return true;
  }

  // If local SQLite file exists, allow in development only if DATABASE_ENABLED is not false
  if (dbUrl.startsWith("file:") && process.env.NODE_ENV !== "production") {
    return process.env.DATABASE_ENABLED !== "false";
  }

  return false;
}

export function isDemoMode(): boolean {
  return !isDatabaseEnabled();
}

export function isAiEnabled(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
}

export function isPaymentLive(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== "");
}

export const APP_CONFIG = {
  name: "MarketSphere",
  description: "Enterprise Multi-Vendor E-Commerce Marketplace",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultCurrency: "USD",
  platformCommissionRate: 10.0, // 10% default platform fee
  demoNotice: "MarketSphere is running in Database-Off Demo Mode. All catalog items, vendors, and orders are simulated safely.",
};
