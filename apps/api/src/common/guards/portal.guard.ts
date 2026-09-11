import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { canAccessPortal, type PortalType } from '@hive/auth';

export const PORTAL_KEY = 'required_portal';
export const RequirePortal = (portal: PortalType) => SetMetadata(PORTAL_KEY, portal);

@Injectable()
export class PortalGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPortal = this.reflector.getAllAndOverride<PortalType>(PORTAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPortal) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        `Authentication required to access the ${requiredPortal === 'FRONT_DESK' ? 'Front Desk' : 'Back Office'} workspace.`
      );
    }

    const hasAccess = canAccessPortal(user.role, requiredPortal);

    if (!hasAccess) {
      throw new ForbiddenException(
        `Portal access denied. Your assigned role (${user.role}) is not authorized to access the ${requiredPortal === 'FRONT_DESK' ? 'Front Desk' : 'Back Office'} portal.`
      );
    }

    return true;
  }
}
