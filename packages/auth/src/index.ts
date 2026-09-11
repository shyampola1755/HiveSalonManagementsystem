import { PERMISSION_FLAGS, SYSTEM_ROLES, type PermissionFlag, type SystemRole } from '@hive/config';
import type { User, Branch, Organization, UserScope, ScopeType, PortalType } from '@hive/types';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export const PERMISSIONS = PERMISSION_FLAGS;
export type Permission = PermissionFlag;

export type { PortalType };

/**
 * Roles that default to the FRONT DESK portal workspace
 */
export const FRONT_DESK_ROLES = [
  SYSTEM_ROLES.FRONT_DESK,
  SYSTEM_ROLES.STYLIST,
  SYSTEM_ROLES.THERAPIST,
  SYSTEM_ROLES.CLIENT,
] as const;

/**
 * Roles that default to the BACK OFFICE administrative workspace
 */
export const BACK_OFFICE_ROLES = [
  SYSTEM_ROLES.SUPER_ADMIN,
  SYSTEM_ROLES.ORGANIZATION_OWNER,
  SYSTEM_ROLES.REGIONAL_MANAGER,
  SYSTEM_ROLES.DISTRICT_MANAGER,
  SYSTEM_ROLES.CITY_MANAGER,
  SYSTEM_ROLES.BRANCH_MANAGER,
  SYSTEM_ROLES.ACCOUNTANT,
  SYSTEM_ROLES.INVENTORY_MANAGER,
  SYSTEM_ROLES.HR_MANAGER,
  SYSTEM_ROLES.MARKETING_MANAGER,
] as const;

/**
 * Roles authorized to switch between BOTH Front Desk and Back Office portals
 */
export const DUAL_PORTAL_ROLES = [
  SYSTEM_ROLES.SUPER_ADMIN,
  SYSTEM_ROLES.ORGANIZATION_OWNER,
  SYSTEM_ROLES.BRANCH_MANAGER,
  SYSTEM_ROLES.REGIONAL_MANAGER,
  SYSTEM_ROLES.DISTRICT_MANAGER,
  SYSTEM_ROLES.CITY_MANAGER,
] as const;

/**
 * Resolves the primary default portal for an authenticated role
 */
export function getDefaultPortal(role: string): PortalType {
  if (role === SYSTEM_ROLES.FRONT_DESK || role === SYSTEM_ROLES.STYLIST || role === SYSTEM_ROLES.THERAPIST) {
    return 'FRONT_DESK';
  }
  return 'BACK_OFFICE';
}

/**
 * Evaluates whether a role is authorized to access a given portal
 */
export function canAccessPortal(role: string, targetPortal: PortalType): boolean {
  if (DUAL_PORTAL_ROLES.includes(role as any)) {
    return true;
  }
  const defaultPortal = getDefaultPortal(role);
  return defaultPortal === targetPortal;
}

/**
 * Returns the list of portals accessible to a role
 */
export function getAllowedPortals(role: string): PortalType[] {
  if (DUAL_PORTAL_ROLES.includes(role as any)) {
    return ['FRONT_DESK', 'BACK_OFFICE'];
  }
  return [getDefaultPortal(role)];
}

/**
 * 14 Roles to Granular Permissions Matrix
 */
export const ROLE_PERMISSIONS: Record<SystemRole, PermissionFlag[]> = {
  // 1. Super Admin (Master authority)
  [SYSTEM_ROLES.SUPER_ADMIN]: Object.values(PERMISSION_FLAGS),

  // 2. Organization Owner (Org-wide authority)
  [SYSTEM_ROLES.ORGANIZATION_OWNER]: Object.values(PERMISSION_FLAGS),

  // 3. Regional Manager (State-wide authority)
  [SYSTEM_ROLES.REGIONAL_MANAGER]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.SERVICES_VIEW,
    PERMISSION_FLAGS.SERVICES_EDIT,
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.BILLING_VIEW,
    PERMISSION_FLAGS.INVENTORY_VIEW,
    PERMISSION_FLAGS.INVENTORY_TRANSFER,
    PERMISSION_FLAGS.STAFF_VIEW,
    PERMISSION_FLAGS.STAFF_MANAGE,
    PERMISSION_FLAGS.HIERARCHY_DISTRICT_MANAGE,
    PERMISSION_FLAGS.HIERARCHY_CITY_MANAGE,
    PERMISSION_FLAGS.HIERARCHY_BRANCH_MANAGE,
    PERMISSION_FLAGS.REPORTS_DISTRICT,
    PERMISSION_FLAGS.REPORTS_CITY,
    PERMISSION_FLAGS.REPORTS_BRANCH,
    PERMISSION_FLAGS.REPORTS_EXPORT,
  ],

  // 4. District Manager
  [SYSTEM_ROLES.DISTRICT_MANAGER]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.SERVICES_VIEW,
    PERMISSION_FLAGS.SERVICES_EDIT,
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.BILLING_VIEW,
    PERMISSION_FLAGS.INVENTORY_VIEW,
    PERMISSION_FLAGS.STAFF_VIEW,
    PERMISSION_FLAGS.HIERARCHY_CITY_MANAGE,
    PERMISSION_FLAGS.HIERARCHY_BRANCH_MANAGE,
    PERMISSION_FLAGS.REPORTS_CITY,
    PERMISSION_FLAGS.REPORTS_BRANCH,
    PERMISSION_FLAGS.REPORTS_EXPORT,
  ],

  // 5. City Manager
  [SYSTEM_ROLES.CITY_MANAGER]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.SERVICES_VIEW,
    PERMISSION_FLAGS.SERVICES_EDIT,
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.BILLING_VIEW,
    PERMISSION_FLAGS.INVENTORY_VIEW,
    PERMISSION_FLAGS.STAFF_VIEW,
    PERMISSION_FLAGS.HIERARCHY_BRANCH_MANAGE,
    PERMISSION_FLAGS.REPORTS_BRANCH,
    PERMISSION_FLAGS.REPORTS_EXPORT,
  ],

  // 6. Branch Manager
  [SYSTEM_ROLES.BRANCH_MANAGER]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.CUSTOMERS_CREATE,
    PERMISSION_FLAGS.CUSTOMERS_EDIT,
    PERMISSION_FLAGS.SERVICES_VIEW,
    PERMISSION_FLAGS.SERVICES_CREATE,
    PERMISSION_FLAGS.SERVICES_EDIT,
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_CREATE,
    PERMISSION_FLAGS.APPOINTMENTS_EDIT,
    PERMISSION_FLAGS.APPOINTMENTS_CANCEL,
    PERMISSION_FLAGS.APPOINTMENTS_ASSIGN,
    PERMISSION_FLAGS.BILLING_VIEW,
    PERMISSION_FLAGS.BILLING_CREATE,
    PERMISSION_FLAGS.BILLING_REFUND,
    PERMISSION_FLAGS.BILLING_DISCOUNT,
    PERMISSION_FLAGS.INVENTORY_VIEW,
    PERMISSION_FLAGS.INVENTORY_ADJUST,
    PERMISSION_FLAGS.INVENTORY_TRANSFER,
    PERMISSION_FLAGS.STAFF_VIEW,
    PERMISSION_FLAGS.STAFF_MANAGE,
    PERMISSION_FLAGS.STAFF_ATTENDANCE,
    PERMISSION_FLAGS.STAFF_COMMISSION,
    PERMISSION_FLAGS.REPORTS_BRANCH,
  ],

  // 7. Front Desk / Receptionist
  [SYSTEM_ROLES.FRONT_DESK]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.CUSTOMERS_CREATE,
    PERMISSION_FLAGS.CUSTOMERS_EDIT,
    PERMISSION_FLAGS.SERVICES_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_CREATE,
    PERMISSION_FLAGS.APPOINTMENTS_EDIT,
    PERMISSION_FLAGS.APPOINTMENTS_CANCEL,
    PERMISSION_FLAGS.BILLING_VIEW,
    PERMISSION_FLAGS.BILLING_CREATE,
    PERMISSION_FLAGS.INVENTORY_VIEW,
    PERMISSION_FLAGS.STAFF_VIEW,
  ],

  // 8. Stylist
  [SYSTEM_ROLES.STYLIST]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.SERVICES_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_EDIT,
    PERMISSION_FLAGS.STAFF_COMMISSION,
  ],

  // 9. Therapist
  [SYSTEM_ROLES.THERAPIST]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.SERVICES_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_EDIT,
    PERMISSION_FLAGS.STAFF_COMMISSION,
  ],

  // 10. Accountant
  [SYSTEM_ROLES.ACCOUNTANT]: [
    PERMISSION_FLAGS.BILLING_VIEW,
    PERMISSION_FLAGS.BILLING_REFUND,
    PERMISSION_FLAGS.BILLING_VOID,
    PERMISSION_FLAGS.REPORTS_ORGANIZATION,
    PERMISSION_FLAGS.REPORTS_DISTRICT,
    PERMISSION_FLAGS.REPORTS_CITY,
    PERMISSION_FLAGS.REPORTS_BRANCH,
    PERMISSION_FLAGS.REPORTS_EXPORT,
    PERMISSION_FLAGS.AUDIT_VIEW,
  ],

  // 11. Inventory Manager
  [SYSTEM_ROLES.INVENTORY_MANAGER]: [
    PERMISSION_FLAGS.INVENTORY_VIEW,
    PERMISSION_FLAGS.INVENTORY_ADJUST,
    PERMISSION_FLAGS.INVENTORY_TRANSFER,
    PERMISSION_FLAGS.INVENTORY_PURCHASE_ORDER,
  ],

  // 12. HR Manager
  [SYSTEM_ROLES.HR_MANAGER]: [
    PERMISSION_FLAGS.STAFF_VIEW,
    PERMISSION_FLAGS.STAFF_MANAGE,
    PERMISSION_FLAGS.STAFF_ATTENDANCE,
    PERMISSION_FLAGS.STAFF_COMMISSION,
    PERMISSION_FLAGS.REPORTS_BRANCH,
    PERMISSION_FLAGS.USERS_MANAGE,
  ],

  // 13. Marketing Manager
  [SYSTEM_ROLES.MARKETING_MANAGER]: [
    PERMISSION_FLAGS.CUSTOMERS_VIEW,
    PERMISSION_FLAGS.CUSTOMERS_EXPORT,
    PERMISSION_FLAGS.REPORTS_ORGANIZATION,
    PERMISSION_FLAGS.REPORTS_EXPORT,
  ],

  // 14. Client / Customer Portal
  [SYSTEM_ROLES.CLIENT]: [
    PERMISSION_FLAGS.APPOINTMENTS_VIEW,
    PERMISSION_FLAGS.APPOINTMENTS_CREATE,
    PERMISSION_FLAGS.APPOINTMENTS_CANCEL,
  ],
};

/**
 * Evaluates whether a user role (or custom permissions) possesses the required permission
 */
export function hasPermission(
  role: string,
  requiredPermission: PermissionFlag,
  customPermissions?: string[]
): boolean {
  if (role === SYSTEM_ROLES.SUPER_ADMIN || role === SYSTEM_ROLES.ORGANIZATION_OWNER) {
    return true;
  }
  const defaultRolePermissions = ROLE_PERMISSIONS[role as SystemRole] || [];
  if (defaultRolePermissions.includes(requiredPermission)) {
    return true;
  }
  if (customPermissions && customPermissions.includes(requiredPermission)) {
    return true;
  }
  return false;
}

/**
 * Evaluates whether a user has access to a specific branch
 */
export function canAccessBranch(
  userRole: string,
  assignedBranchIds: string[],
  userScopes: UserScope[] = [],
  targetBranchId: string,
  targetBranchCityId?: string,
  targetBranchDistrictId?: string,
  targetBranchStateId?: string
): boolean {
  if (userRole === SYSTEM_ROLES.SUPER_ADMIN || userRole === SYSTEM_ROLES.ORGANIZATION_OWNER) {
    return true;
  }

  if (assignedBranchIds.includes(targetBranchId)) {
    return true;
  }

  for (const scope of userScopes) {
    if (scope.scopeType === 'BRANCH' && scope.targetId === targetBranchId) {
      return true;
    }
    if (scope.scopeType === 'CITY' && targetBranchCityId && scope.targetId === targetBranchCityId) {
      return true;
    }
    if (
      scope.scopeType === 'DISTRICT' &&
      targetBranchDistrictId &&
      scope.targetId === targetBranchDistrictId
    ) {
      return true;
    }
    if (scope.scopeType === 'STATE' && targetBranchStateId && scope.targetId === targetBranchStateId) {
      return true;
    }
    if (scope.scopeType === 'ORGANIZATION') {
      return true;
    }
  }

  return false;
}

export interface UserSession {
  user: User;
  organization: Organization;
  currentBranch: Branch;
  availableBranches: Branch[];
  token: string;
  activePortal: PortalType;
  allowedPortals: PortalType[];
}

export interface AuthState {
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SALT_ROUNDS = 12;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

export function generateNumericOtp(): string {
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
