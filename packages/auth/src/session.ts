import type { User, Branch, Organization } from '@hive/types';

export interface UserSession {
  user: User;
  organization: Organization;
  currentBranch: Branch;
  availableBranches: Branch[];
  token: string;
}

export interface AuthState {
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
