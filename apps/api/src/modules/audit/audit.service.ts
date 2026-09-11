import { Injectable, OnModuleInit } from '@nestjs/common';
import { eventBus, type AuditEvent } from '@hive/events';

@Injectable()
export class AuditService implements OnModuleInit {
  private inMemoryLogs: any[] = [];

  onModuleInit() {
    eventBus.on('AUDIT_LOG_EMITTED', (event: AuditEvent) => {
      this.handleAuditEvent(event);
    });
  }

  private handleAuditEvent(event: AuditEvent) {
    this.inMemoryLogs.unshift(event.payload);
    if (this.inMemoryLogs.length > 500) {
      this.inMemoryLogs.pop();
    }
  }

  getAuditLogs() {
    return this.inMemoryLogs;
  }
}
