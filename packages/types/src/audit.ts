/**
 * Audit Logging Types
 */

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  branchId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface CreateAuditLogDto {
  organizationId: string;
  branchId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}
