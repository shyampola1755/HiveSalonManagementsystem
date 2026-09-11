import type { CreateAuditLogDto } from '@hive/types';

export interface BaseEvent {
  eventId: string;
  timestamp: string;
  organizationId: string;
  branchId?: string | null;
}

export interface AuditEvent extends BaseEvent {
  type: 'AUDIT_LOG_EMITTED';
  payload: CreateAuditLogDto;
}

export interface NotificationEvent extends BaseEvent {
  type: 'NOTIFICATION_TRIGGERED';
  channel: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'IN_APP';
  recipient: string;
  templateId: string;
  params: Record<string, string | number>;
}

export interface EntityChangeEvent extends BaseEvent {
  type: 'ENTITY_MUTATED';
  entity: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  data: Record<string, unknown>;
}

export type HiveAppEvent = AuditEvent | NotificationEvent | EntityChangeEvent;
