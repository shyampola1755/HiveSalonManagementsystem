import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required to access tenant resources.');
    }

    if (!user.organizationId) {
      throw new ForbiddenException('User is not associated with an active organization.');
    }

    // Never trust client-supplied organizationId from body or query params
    const clientSuppliedOrgId =
      request.body?.organizationId || request.query?.organizationId || request.params?.organizationId;

    if (clientSuppliedOrgId && clientSuppliedOrgId !== user.organizationId) {
      throw new ForbiddenException(
        'Cross-organization access denied. You are only authorized within your assigned organization.'
      );
    }

    return true;
  }
}
