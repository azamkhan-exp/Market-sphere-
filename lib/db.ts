import { PrismaClient } from "@prisma/client";
import { isDatabaseEnabled } from "./config";
import {
  DEMO_PRODUCTS,
  DEMO_CATEGORIES,
  DEMO_SELLERS,
  DEMO_USERS,
  DEMO_ORDERS,
  DEMO_REVIEWS,
  DEMO_COUPONS,
  DEMO_AUDIT_LOGS,
} from "@/repositories/demo/demoData";
import { DemoProductRepository } from "@/repositories/demo/demoProductRepository";
import { DemoOrderRepository } from "@/repositories/demo/demoOrderRepository";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getRealPrismaClient(): PrismaClient | null {
  if (!isDatabaseEnabled()) return null;

  try {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
    }
    return globalForPrisma.prisma;
  } catch (err) {
    console.warn("Prisma initialization bypassed:", err);
    return null;
  }
}

// In-memory demo fallback storage
let mockCarts: any[] = [];

// Safe in-memory mock collection router
const demoModels: Record<string, any> = {
  product: {
    findMany: async (args: any = {}) => {
      let list = [...DEMO_PRODUCTS];
      if (args.where?.status) {
        list = list.filter((p) => p.status === args.where.status);
      }
      if (args.where?.isFlashDeal) {
        list = list.filter((p) => p.isFlashDeal);
      }
      if (args.where?.isFeatured) {
        list = list.filter((p) => p.isFeatured);
      }
      if (args.where?.categoryId) {
        list = list.filter((p) => p.categoryId === args.where.categoryId);
      }
      if (args.where?.sellerId) {
        list = list.filter((p) => p.sellerId === args.where.sellerId);
      }
      if (args.where?.id?.not) {
        list = list.filter((p) => p.id !== args.where.id.not);
      }
      if (args.take) {
        list = list.slice(0, args.take);
      }
      return list;
    },
    findUnique: async (args: any = {}) => {
      if (args.where?.slug) return DEMO_PRODUCTS.find((p) => p.slug === args.where.slug) || null;
      if (args.where?.id) return DEMO_PRODUCTS.find((p) => p.id === args.where.id) || null;
      return null;
    },
    findFirst: async (args: any = {}) => {
      return (await demoModels.product.findMany(args))[0] || null;
    },
    count: async (args: any = {}) => {
      return (await demoModels.product.findMany(args)).length;
    },
    create: async (args: any) => {
      return DemoProductRepository.create(args.data);
    },
    update: async (args: any) => {
      return DemoProductRepository.update(args.where.id, args.data);
    },
    delete: async (args: any) => {
      return DemoProductRepository.delete(args.where.id);
    },
  },
  category: {
    findMany: async (args: any = {}) => {
      let list = DEMO_CATEGORIES.map((c) => ({
        ...c,
        _count: { products: c.productCount || 8 },
      }));
      if (args.where?.isFeatured) {
        list = list.filter((c) => c.isFeatured);
      }
      if (args.take) {
        list = list.slice(0, args.take);
      }
      return list;
    },
    findUnique: async (args: any = {}) => {
      return DEMO_CATEGORIES.find((c) => c.slug === args.where?.slug || c.id === args.where?.id) || null;
    },
    findFirst: async (args: any = {}) => {
      return (await demoModels.category.findMany(args))[0] || null;
    },
    count: async () => DEMO_CATEGORIES.length,
  },
  user: {
    findUnique: async (args: any = {}) => {
      if (args.where?.email) {
        return DEMO_USERS.find((u) => u.email.toLowerCase() === args.where.email.toLowerCase()) || null;
      }
      if (args.where?.id) {
        return DEMO_USERS.find((u) => u.id === args.where.id) || null;
      }
      return null;
    },
    findFirst: async (args: any = {}) => {
      return DEMO_USERS[0] || null;
    },
    findMany: async () => [...DEMO_USERS],
    count: async () => DEMO_USERS.length,
    create: async (args: any) => {
      const newUser = { id: `usr_${Date.now()}`, ...args.data, createdAt: new Date() };
      DEMO_USERS.push(newUser);
      return newUser;
    },
  },
  seller: {
    findUnique: async (args: any = {}) => {
      if (args.where?.id) return DEMO_SELLERS.find((s) => s.id === args.where.id) || null;
      if (args.where?.slug) return DEMO_SELLERS.find((s) => s.slug === args.where.slug) || null;
      if (args.where?.userId) return DEMO_SELLERS.find((s) => s.userId === args.where.userId) || null;
      return null;
    },
    findFirst: async () => DEMO_SELLERS[0] || null,
    findMany: async () => [...DEMO_SELLERS],
    count: async () => DEMO_SELLERS.length,
  },
  order: {
    findMany: async (args: any = {}) => {
      let list = [...DEMO_ORDERS];
      if (args.where?.userId) list = list.filter((o) => o.userId === args.where.userId);
      if (args.take) list = list.slice(0, args.take);
      return list;
    },
    findUnique: async (args: any = {}) => {
      return DEMO_ORDERS.find((o) => o.id === args.where?.id || o.orderNumber === args.where?.orderNumber) || null;
    },
    findFirst: async (args: any = {}) => {
      return (await demoModels.order.findMany(args))[0] || null;
    },
    count: async () => DEMO_ORDERS.length,
    create: async (args: any) => {
      return DemoOrderRepository.create(args.data);
    },
  },
  orderItem: {
    findMany: async (args: any = {}) => {
      let items = DEMO_ORDERS.flatMap((o) => o.items);
      if (args.where?.sellerId) items = items.filter((i) => i.sellerId === args.where.sellerId);
      if (args.take) items = items.slice(0, args.take);
      return items;
    },
  },
  review: {
    findMany: async (args: any = {}) => {
      let list = [...DEMO_REVIEWS];
      if (args.where?.productId) list = list.filter((r) => r.productId === args.where.productId);
      if (args.where?.product?.sellerId) {
        const prodIds = new Set(DEMO_PRODUCTS.filter((p) => p.sellerId === args.where.product.sellerId).map((p) => p.id));
        list = list.filter((r) => prodIds.has(r.productId));
      }
      if (args.take) list = list.slice(0, args.take);
      return list;
    },
    create: async (args: any) => {
      const rev = { id: `rev_${Date.now()}`, ...args.data, createdAt: new Date() };
      DEMO_REVIEWS.unshift(rev);
      return rev;
    },
  },
  coupon: {
    findUnique: async (args: any = {}) => {
      if (args.where?.code) return DEMO_COUPONS.find((c) => c.code === args.where.code.toUpperCase()) || null;
      if (args.where?.id) return DEMO_COUPONS.find((c) => c.id === args.where.id) || null;
      return null;
    },
    findFirst: async (args: any = {}) => {
      if (args.where?.code) return DEMO_COUPONS.find((c) => c.code === args.where.code.toUpperCase()) || null;
      return DEMO_COUPONS[0] || null;
    },
    findMany: async () => [...DEMO_COUPONS],
  },
  cart: {
    findFirst: async (args: any = {}) => {
      let c = mockCarts.find((cart) => (args.where?.userId && cart.userId === args.where.userId) || (args.where?.sessionId && cart.sessionId === args.where.sessionId));
      if (!c) return null;
      return { ...c, items: c.items || [] };
    },
    findUnique: async (args: any = {}) => {
      let c = mockCarts.find((cart) => cart.id === args.where?.id);
      if (!c) return null;
      return { ...c, items: c.items || [] };
    },
    create: async (args: any) => {
      const cart = { id: `cart_${Date.now()}`, items: [], subtotal: 0, total: 0, ...args.data };
      mockCarts.push(cart);
      return cart;
    },
    update: async (args: any) => {
      const idx = mockCarts.findIndex((c) => c.id === args.where.id);
      if (idx !== -1) {
        Object.assign(mockCarts[idx], args.data);
        return { ...mockCarts[idx], items: mockCarts[idx].items || [] };
      }
      return null;
    },
  },
  cartItem: {
    findUnique: async (args: any = {}) => {
      for (const c of mockCarts) {
        const it = c.items?.find((i: any) => i.id === args.where?.id);
        if (it) {
          const prod = DEMO_PRODUCTS.find((p) => p.id === it.productId);
          return { ...it, product: prod, variant: null };
        }
      }
      return null;
    },
    findFirst: async (args: any = {}) => {
      for (const c of mockCarts) {
        if (args.where?.cartId && c.id !== args.where.cartId) continue;
        const it = c.items?.find((i: any) => i.productId === args.where?.productId);
        if (it) {
          const prod = DEMO_PRODUCTS.find((p) => p.id === it.productId);
          return { ...it, product: prod, variant: null };
        }
      }
      return null;
    },
    create: async (args: any) => {
      const item = { id: `ci_${Date.now()}`, ...args.data };
      const prod = DEMO_PRODUCTS.find((p) => p.id === args.data.productId);
      item.product = prod;
      const cart = mockCarts.find((c) => c.id === args.data.cartId);
      if (cart) {
        if (!cart.items) cart.items = [];
        cart.items.push(item);
      }
      return item;
    },
    delete: async (args: any) => {
      mockCarts.forEach((c) => {
        if (c.items) c.items = c.items.filter((i: any) => i.id !== args.where.id);
      });
      return { id: args.where.id };
    },
    update: async (args: any) => {
      let updated = null;
      mockCarts.forEach((c) => {
        if (c.items) {
          const item = c.items.find((i: any) => i.id === args.where.id);
          if (item) {
            Object.assign(item, args.data);
            updated = item;
          }
        }
      });
      return updated;
    },
  },
  wishlist: {
    findFirst: async (args: any = {}) => {
      return {
        id: `wish_${args.where?.userId || "demo"}`,
        userId: args.where?.userId,
        items: DEMO_PRODUCTS.slice(0, 3).map((p, idx) => ({
          id: `wi_${idx}`,
          productId: p.id,
          product: p,
        })),
      };
    },
  },
  auditLog: {
    findMany: async () => [...DEMO_AUDIT_LOGS],
    create: async (args: any) => {
      const log = { id: `log_${Date.now()}`, ...args.data, createdAt: new Date() };
      DEMO_AUDIT_LOGS.unshift(log);
      return log;
    },
  },
  notification: {
    findMany: async () => [],
    count: async () => 0,
    create: async (args: any) => ({ id: `notif_${Date.now()}`, ...args.data }),
  },
  priceHistory: {
    findMany: async () => [],
    create: async (args: any) => ({ id: `ph_${Date.now()}`, ...args.data }),
  },
  stockAlert: {
    findMany: async () => [],
    create: async (args: any) => ({ id: `sa_${Date.now()}`, ...args.data }),
  },
  priceAlert: {
    findMany: async () => [],
    create: async (args: any) => ({ id: `pa_${Date.now()}`, ...args.data }),
  },
};

// Proxied database client: automatically routes to real Prisma when DB is enabled,
// or safe in-memory demo collections when DB is disabled (default).
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: string) {
    if (prop === "$transaction") {
      return async (cb: any) => {
        if (typeof cb === "function") {
          return cb(db);
        }
        return Promise.all(cb);
      };
    }

    if (prop === "$connect" || prop === "$disconnect") {
      return async () => {};
    }

    const realPrisma = getRealPrismaClient();
    if (realPrisma) {
      return (realPrisma as any)[prop];
    }

    if (demoModels[prop]) {
      return demoModels[prop];
    }

    // Generic safe fallback for any unmapped model
    return {
      findMany: async () => [],
      findUnique: async () => null,
      findFirst: async () => null,
      count: async () => 0,
      create: async (args: any) => ({ id: `mock_${Date.now()}`, ...args?.data }),
      update: async (args: any) => ({ id: args?.where?.id, ...args?.data }),
      delete: async (args: any) => ({ id: args?.where?.id }),
      deleteMany: async () => ({ count: 0 }),
      createMany: async (args: any) => ({ count: args?.data?.length || 0 }),
    };
  },
});
