/**
 * Authentication, Session & Access Control Types
 */
import type { User, Organization, Branch, UserScope } from './domain';

export interface LoginPayload {
  identifier: string; // Email or Mobile Number
  password: string;
  rememberMe?: boolean;
}

export type PortalType = 'FRONT_DESK' | 'BACK_OFFICE';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthSession {
  user: User;
  organization: Organization;
  currentBranch: Branch;
  availableBranches: Branch[];
  scopes: UserScope[];
  tokens: AuthTokens;
  activePortal: PortalType;
  allowedPortals: PortalType[];
}

export interface ForgotPasswordPayload {
  identifier: string; // Email or Mobile Number
}

export interface VerifyOtpPayload {
  identifier: string;
  otp: string;
}

export interface ResetPasswordPayload {
  identifier: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  isRevoked: boolean;
  expiresAt: string;
  createdAt: string;
}
