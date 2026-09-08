export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED", "REFUNDED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export class OrderStateMachineError extends Error {
  constructor(
    public currentStatus: OrderStatus,
    public attemptedStatus: OrderStatus
  ) {
    super(
      `Invalid order status transition from ${currentStatus} to ${attemptedStatus}. Allowed transitions: [${(
        ALLOWED_TRANSITIONS[currentStatus] || []
      ).join(", ")}]`
    );
    this.name = "OrderStateMachineError";
  }
}

/**
 * Returns true if the transition from currentStatus to nextStatus is permitted
 */
export function canTransitionOrder(currentStatus: string, nextStatus: string): boolean {
  const allowed = ALLOWED_TRANSITIONS[currentStatus as OrderStatus];
  if (!allowed) return false;
  return allowed.includes(nextStatus as OrderStatus);
}

/**
 * Validates the transition, throwing an OrderStateMachineError if disallowed
 */
export function validateOrderTransition(currentStatus: string, nextStatus: string): void {
  if (!canTransitionOrder(currentStatus, nextStatus)) {
    throw new OrderStateMachineError(currentStatus as OrderStatus, nextStatus as OrderStatus);
  }
}

/**
 * Metadata for visual indicators across storefront, customer account, seller, and admin
 */
export function getOrderStatusMeta(status: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "Order Placed",
        description: "Awaiting payment processing or verification",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      };
    case "CONFIRMED":
      return {
        label: "Confirmed",
        description: "Payment verified, awaiting vendor dispatch preparation",
        badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        description: "Vendors are currently packaging items for courier dispatch",
        badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
      };
    case "SHIPPED":
      return {
        label: "Dispatched",
        description: "Handed over to delivery carrier with live tracking",
        badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
      };
    case "OUT_FOR_DELIVERY":
      return {
        label: "Out for Delivery",
        description: "With courier driver on local delivery route",
        badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
      };
    case "DELIVERED":
      return {
        label: "Delivered",
        description: "Package delivered safely to destination address",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        description: "Order was cancelled and inventory restored",
        badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        description: "Payment returned to original payment method",
        badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
      };
    default:
      return {
        label: status,
        description: "",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}
