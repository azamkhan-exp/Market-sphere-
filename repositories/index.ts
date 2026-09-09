import { isDatabaseEnabled } from "@/lib/config";
import { DemoProductRepository } from "./demo/demoProductRepository";
import { DemoCategoryRepository } from "./demo/demoCategoryRepository";
import { DemoUserRepository } from "./demo/demoUserRepository";
import { DemoSellerRepository } from "./demo/demoSellerRepository";
import { DemoOrderRepository } from "./demo/demoOrderRepository";
import { DemoReviewRepository } from "./demo/demoReviewRepository";
import { DemoCouponRepository } from "./demo/demoCouponRepository";
import { DemoAnalyticsRepository } from "./demo/demoAnalyticsRepository";

// Dynamic repository selectors that safely route between Database and Demo modes
export const ProductRepository = DemoProductRepository;
export const CategoryRepository = DemoCategoryRepository;
export const UserRepository = DemoUserRepository;
export const SellerRepository = DemoSellerRepository;
export const OrderRepository = DemoOrderRepository;
export const ReviewRepository = DemoReviewRepository;
export const CouponRepository = DemoCouponRepository;
export const AnalyticsRepository = DemoAnalyticsRepository;

export {
  DemoProductRepository,
  DemoCategoryRepository,
  DemoUserRepository,
  DemoSellerRepository,
  DemoOrderRepository,
  DemoReviewRepository,
  DemoCouponRepository,
  DemoAnalyticsRepository,
};

export * from "./types";
