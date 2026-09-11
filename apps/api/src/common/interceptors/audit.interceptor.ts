import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { eventBus } from '@hive/events';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;

    // Only audit mutations (POST, PUT, PATCH, DELETE)
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return next.handle().pipe(
      tap((responseBody) => {
        if (isMutation) {
          eventBus.emitAudit({
            organizationId: user?.organizationId || 'demo-org-id',
            branchId: user?.currentBranchId || null,
            userId: user?.id || null,
            userEmail: user?.email || 'admin@hivesalon.com',
            userRole: user?.role || 'ORGANIZATION_OWNER',
            action: method,
            entity: url.split('/')[2]?.toUpperCase() || 'SYSTEM',
            entityId: responseBody?.id || 'unknown',
            newValue: responseBody,
            ipAddress: ip,
            userAgent: headers['user-agent'],
          });
        }
      })
    );
  }
}
