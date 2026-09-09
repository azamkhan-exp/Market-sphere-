import { DEMO_COUPONS } from "./demoData";
import { CouponItem } from "../types";

let inMemoryCoupons = [...DEMO_COUPONS];

export class DemoCouponRepository {
  static async findByCode(code: string): Promise<CouponItem | null> {
    const coupon = inMemoryCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    return coupon ? { ...coupon } : null;
  }

  static async getAll(): Promise<CouponItem[]> {
    return [...inMemoryCoupons];
  }

  static async create(data: Partial<CouponItem>): Promise<CouponItem> {
    const newCoupon: CouponItem = {
      id: `cpn_${Date.now()}`,
      code: (data.code || `PROMO${Date.now().toString().slice(-4)}`).toUpperCase(),
      description: data.description || "Promotional Discount",
      discountType: data.discountType || "PERCENTAGE",
      discountValue: Number(data.discountValue) || 10,
      minSpend: data.minSpend ? Number(data.minSpend) : null,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : 1000,
      usageCount: 0,
      isActive: true,
    };

    inMemoryCoupons.unshift(newCoupon);
    return newCoupon;
  }

  static async delete(id: string): Promise<boolean> {
    const initialLen = inMemoryCoupons.length;
    inMemoryCoupons = inMemoryCoupons.filter((c) => c.id !== id);
    return inMemoryCoupons.length < initialLen;
  }
}
