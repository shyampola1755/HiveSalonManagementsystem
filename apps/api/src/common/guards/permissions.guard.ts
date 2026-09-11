import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission } from '@hive/auth';
import type { PermissionFlag } from '@hive/config';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: PermissionFlag[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionFlag[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        "You don't have permission to perform this action. Contact your administrator if you need access."
      );
    }

    const hasAll = requiredPermissions.every((perm) =>
      hasPermission(user.role, perm, user.customPermissions)
    );

    if (!hasAll) {
      throw new ForbiddenException(
        "You don't have permission to perform this action. Contact your administrator if you need access."
      );
    }

    return true;
  }
}
