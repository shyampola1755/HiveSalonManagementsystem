import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { canAccessBranch } from '@hive/auth';

@Injectable()
export class ScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true;
    }

    const targetBranchId =
      request.params?.branchId || request.query?.branchId || request.body?.branchId;

    if (!targetBranchId) {
      return true;
    }

    const hasAccess = canAccessBranch(
      user.role,
      user.assignedBranchIds || [],
      user.scopes || [],
      targetBranchId
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'Cross-branch access denied. You do not have authorization to view or manage resources in this branch.'
      );
    }

    return true;
  }
}
