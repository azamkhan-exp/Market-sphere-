import { db } from "./db";

export interface CreateAuditLogParams {
  actorId?: string;
  actorRole: "ADMIN" | "SELLER" | "CUSTOMER" | "SYSTEM";
  action: string;
  entityType: "USER" | "SELLER" | "PRODUCT" | "ORDER" | "COUPON" | "CATEGORY" | "SYSTEM";
  entityId: string;
  changesJson?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    return await db.auditLog.create({
      data: {
        actorId: params.actorId,
        actorRole: params.actorRole,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        changesJson: params.changesJson,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    return null;
  }
}
