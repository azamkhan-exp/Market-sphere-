import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CUSTOMER", "SELLER"]).default("CUSTOMER"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  headline: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.number().positive("Base price must be positive"),
  salePrice: z.number().positive().optional().nullable(),
  stockQuantity: z.number().int().nonnegative("Stock cannot be negative"),
  lowStockThreshold: z.number().int().default(5),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional().nullable(),
  sku: z.string().min(3, "SKU is required"),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
  images: z.array(z.string().url()).min(1, "At least one product image is required"),
});

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().positive().default(1),
});

export const CheckoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    street: z.string().min(3),
    apartment: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4),
    country: z.string().default("United States"),
    phone: z.string().min(7),
  }),
  shippingMethod: z.enum(["STANDARD", "EXPRESS", "OVERNIGHT"]).default("STANDARD"),
  couponCode: z.string().optional(),
  isGift: z.boolean().default(false),
  giftMessage: z.string().optional(),
  paymentIntentId: z.string().min(1),
});

export const ReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, "Review title is required"),
  comment: z.string().min(10, "Review comment must be at least 10 characters"),
  images: z.array(z.string().url()).optional(),
});

export const CouponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().default(0),
  maxDiscountAmount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().default(1000),
  perUserLimit: z.number().int().positive().default(1),
});
