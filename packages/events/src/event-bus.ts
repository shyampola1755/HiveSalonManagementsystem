import { EventEmitter2 } from 'eventemitter2';
import type { HiveAppEvent, AuditEvent } from './event-types';

export class HiveEventBus {
  private static instance: HiveEventBus;
  private emitter: EventEmitter2;

  private constructor() {
    this.emitter = new EventEmitter2({
      wildcard: true,
      delimiter: '.',
      maxListeners: 50,
      verboseMemoryLeak: true,
    });
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
