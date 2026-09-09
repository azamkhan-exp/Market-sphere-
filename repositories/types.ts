export interface ProductImageItem {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary?: boolean;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  name: string;
  price?: number | null;
  stockQuantity: number;
  attributes: Record<string, string>;
}

export interface ProductAttributeItem {
  id?: string;
  name: string;
  value: string;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  headline?: string | null;
  description: string;
  sku: string;
  basePrice: number;
  salePrice?: number | null;
  costPrice?: number | null;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  isFlashDeal: boolean;
  flashDealEnd?: Date | string | null;
  avgRating: number;
  reviewCount: number;
  totalSales: number;
  categoryId: string;
  brandId?: string | null;
  sellerId: string;
  tags?: string | null;
  images: ProductImageItem[];
  variants?: ProductVariantItem[];
  attributes?: ProductAttributeItem[];
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string } | null;
  seller?: { id: string; storeName: string; slug: string; rating?: number } | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ProductFilterParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  flashDealOnly?: boolean;
  sellerId?: string;
  sort?: "relevance" | "price-asc" | "price-desc" | "rating" | "newest" | "best-selling";
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: ProductItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  isFeatured: boolean;
  order: number;
  productCount?: number;
  _count?: { products: number };
}

export interface UserItem {
  id: string;
  email: string;
  name: string;
  passwordHash?: string | null;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  avatar?: string | null;
  phone?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date | string;
  sellerProfile?: {
    id: string;
    storeName: string;
    slug: string;
    status: string;
  } | null;
}

export interface SellerItem {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  logo?: string | null;
  banner?: string | null;
  description?: string | null;
  email?: string;
  phone?: string | null;
  address?: string | null;
  taxId?: string | null;
  bankAccount?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  commissionRate: number;
  rating: number;
  reviewCount: number;
  createdAt: Date | string;
  user?: { name: string; email: string };
  verifications?: Array<{
    id: string;
    documentType: string;
    documentUrl: string;
    status: string;
  }>;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  sellerId: string;
  title: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  productImage?: string;
  product?: { id: string; title: string; slug: string; images?: Array<{ url: string }> };
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: any;
  billingAddress?: any;
  shippingMethod: string;
  couponCode?: string | null;
  isGift: boolean;
  giftMessage?: string | null;
  paymentStatus: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  items: OrderItemRecord[];
  shipment?: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery?: string;
    status: string;
  } | null;
  user?: { name: string; email: string };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ReviewItem {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: Date | string;
  user?: { name: string; avatar?: string | null };
  product?: { title: string; slug: string };
}

export interface CouponItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minSpend?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startDate?: Date | string;
  endDate?: Date | string;
  isActive: boolean;
}

export interface AuditLogItem {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | string | null;
  ipAddress?: string | null;
  createdAt: Date | string;
}
