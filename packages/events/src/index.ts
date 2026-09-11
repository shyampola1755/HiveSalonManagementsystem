import { EventEmitter } from 'events';
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

export class HiveEventBus {
  private static instance: HiveEventBus;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
  }

  public static getInstance(): HiveEventBus {
    if (!HiveEventBus.instance) {
      HiveEventBus.instance = new HiveEventBus();
    }
    return HiveEventBus.instance;
  }

  public emitEvent(event: HiveAppEvent): boolean {
    return this.emitter.emit(event.type, event);
  }

  public emitAudit(auditData: AuditEvent['payload']): boolean {
    const event: AuditEvent = {
      type: 'AUDIT_LOG_EMITTED',
      eventId: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
      organizationId: auditData.organizationId,
      branchId: auditData.branchId,
      payload: auditData,
    };
    return this.emitter.emit('AUDIT_LOG_EMITTED', event);
  }

  public on<T extends HiveAppEvent>(eventType: string, listener: (event: T) => void): void {
    this.emitter.on(eventType, listener);
  }

  public off<T extends HiveAppEvent>(eventType: string, listener: (event: T) => void): void {
    this.emitter.off(eventType, listener);
  }
}

export const eventBus = HiveEventBus.getInstance();
