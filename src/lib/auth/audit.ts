import "server-only";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";

type AuditEventType = (typeof auditLogs.$inferInsert)["eventType"];

interface LogEventParams {
  userId?: string | null;
  eventType: AuditEventType;
  ipAddress?: string;
  details?: string;
}

export async function logEvent(params: LogEventParams): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: params.userId ?? undefined,
      eventType: params.eventType,
      ipAddress: params.ipAddress,
      details: params.details,
    });
  } catch {
    // Audit logging should never crash the main flow
    console.error("[audit] Failed to log event:", params.eventType);
  }
}
