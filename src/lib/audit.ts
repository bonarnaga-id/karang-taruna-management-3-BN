import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export interface AuditLogData {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(
  userId: string | undefined,
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      entity,
      entityId,
      details: details || {},
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}
