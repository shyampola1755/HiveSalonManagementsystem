import { Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_PERMISSIONS, hasPermission } from '@hive/auth';
import { SYSTEM_ROLES, PERMISSION_FLAGS, type SystemRole, type PermissionFlag } from '@hive/config';
import type { User, UserScope, CustomRole } from '@hive/types';

@Injectable()
export class RbacService {
  private users: User[] = [
    {
      id: 'usr_owner',
      organizationId: 'org_hive_luxury',
      email: 'owner@hivesalon.in',
      phone: '+91 9876543210',
      fullName: 'Vikramaditya Roy',
      role: SYSTEM_ROLES.ORGANIZATION_OWNER,
      isActive: true,
      assignedBranchIds: ['b_jh_01', 'b_bh_02', 'b_hc_03', 'b_in_01'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr_mgr_hyd',
      organizationId: 'org_hive_luxury',
      email: 'sarah.jenkins@hivesalon.in',
      phone: '+91 9123456780',
      fullName: 'Sarah Jenkins',
      role: SYSTEM_ROLES.BRANCH_MANAGER,
      isActive: true,
      assignedBranchIds: ['b_jh_01'], // Authorized to Jubilee Hills only
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr_stylist_1',
      organizationId: 'org_hive_luxury',
      email: 'sophia.miller@hivesalon.in',
      phone: '+91 9988776655',
      fullName: 'Sophia Miller',
      role: SYSTEM_ROLES.STYLIST,
      isActive: true,
      assignedBranchIds: ['b_jh_01'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private userScopes: UserScope[] = [
    {
      id: 'scope_1',
      organizationId: 'org_hive_luxury',
      userId: 'usr_owner',
      scopeType: 'ORGANIZATION',
      targetId: 'org_hive_luxury',
      targetName: 'Hive Beauty Group (All Branches)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'scope_2',
      organizationId: 'org_hive_luxury',
      userId: 'usr_mgr_hyd',
      scopeType: 'BRANCH',
      targetId: 'b_jh_01',
      targetName: 'Jubilee Hills Flagship (JH-01)',
      createdAt: new Date().toISOString(),
    },
  ];

  getUsers(organizationId: string): User[] {
    return this.users.map((u) => ({
      ...u,
      scopes: this.userScopes.filter((s) => s.userId === u.id),
    }));
  }

  createUser(organizationId: string, data: Partial<User>): User {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      organizationId,
      email: data.email || '',
      phone: data.phone || '',
      fullName: data.fullName || '',
      role: data.role || SYSTEM_ROLES.FRONT_DESK,
      isActive: true,
      assignedBranchIds: data.assignedBranchIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  assignScope(data: { userId: string; scopeType: any; targetId: string; targetName?: string }): UserScope {
    const newScope: UserScope = {
      id: `scope_${Date.now()}`,
      organizationId: 'org_hive_luxury',
      userId: data.userId,
      scopeType: data.scopeType,
      targetId: data.targetId,
      targetName: data.targetName,
      createdAt: new Date().toISOString(),
    };
    this.userScopes.push(newScope);
    return newScope;
  }

  getRolesAndPermissionsMatrix() {
    return {
      roles: Object.values(SYSTEM_ROLES),
      permissions: Object.values(PERMISSION_FLAGS),
      matrix: ROLE_PERMISSIONS,
    };
  }

  getUserAccessOverview(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const assignedScopes = this.userScopes.filter((s) => s.userId === userId);
    const rolePermissions = ROLE_PERMISSIONS[user.role as SystemRole] || [];

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      scopes: assignedScopes,
      effectivePermissions: rolePermissions,
      isOrgWideAdmin:
        user.role === SYSTEM_ROLES.SUPER_ADMIN ||
        user.role === SYSTEM_ROLES.ORGANIZATION_OWNER,
    };
  }
}
