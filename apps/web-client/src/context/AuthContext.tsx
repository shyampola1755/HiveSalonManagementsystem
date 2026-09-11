import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

export interface UserBranch {
  id: string;
  _id?: string;
  name: string;
  code: string;
  isMainBranch?: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string; // 'SUPER_ADMIN' | 'ORG_ADMIN' | 'BRANCH_MANAGER' | 'FRONT_DESK' | 'STYLIST'
  avatarUrl?: string;
  primaryBranchId?: string;
  organization?: {
    id: string;
    name: string;
    code: string;
    currency: string;
  };
  branches?: UserBranch[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  branches: UserBranch[];
  activeBranchId: string | null;
  activePortal: 'front-desk' | 'back-office';
  isLoading: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  isFrontDesk: boolean;
  isStylist: boolean;
  canAccessBackOffice: boolean;
  login: (token: string, userData: User) => string;
  logout: () => void;
  setActiveBranchId: (branchId: string) => void;
  setActivePortal: (portal: 'front-desk' | 'back-office') => void;
  refreshBranches: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hive_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hive_token'));

  const [branches, setBranches] = useState<UserBranch[]>(() => {
    if (user?.branches && user.branches.length > 0) {
      return user.branches.map((b) => ({
        id: b.id || (b as any)._id,
        _id: b.id || (b as any)._id,
        name: b.name,
        code: b.code,
        isMainBranch: b.isMainBranch,
      }));
    }
    return [
      { id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
      { id: 'mum-01', name: 'Mumbai Salon & Spa (Bandra West)', code: 'MUM-01' },
      { id: 'blr-01', name: 'Bangalore Lounge (Indiranagar)', code: 'BLR-01' },
    ];
  });

  const [activeBranchId, setActiveBranchState] = useState<string | null>(() => {
    return localStorage.getItem('hive_active_branch') || (user?.primaryBranchId ? String(user.primaryBranchId) : null);
  });

  const [activePortal, setActivePortalState] = useState<'front-desk' | 'back-office'>(() => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ORG_ADMIN' || user?.role === 'BRANCH_MANAGER') {
      const savedPortal = localStorage.getItem('hive_portal') as 'front-desk' | 'back-office';
      return savedPortal || 'back-office';
    }
    return 'front-desk';
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Role booleans
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ORG_ADMIN';
  const isManager = user?.role === 'BRANCH_MANAGER';
  const isFrontDesk = user?.role === 'FRONT_DESK';
  const isStylist = user?.role === 'STYLIST';
  const canAccessBackOffice = isSuperAdmin || isManager;

  const refreshBranches = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/branches');
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const formatted: UserBranch[] = res.data.data.map((b: any) => ({
          id: b._id || b.id,
          _id: b._id || b.id,
          name: b.name,
          code: b.code,
          isMainBranch: b.isMainBranch,
        }));
        setBranches(formatted);
        if (user) {
          const updatedUser = { ...user, branches: formatted };
          setUser(updatedUser);
          localStorage.setItem('hive_user', JSON.stringify(updatedUser));
        }
      }
    } catch (e) {
      console.error('Failed to fetch dynamic branches:', e);
    }
  }, [token, user]);

  const login = (newToken: string, userData: User): string => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('hive_token', newToken);
    localStorage.setItem('hive_user', JSON.stringify(userData));

    const branch = userData.primaryBranchId || (userData.branches && userData.branches[0]?.id);
    if (branch) {
      setActiveBranchId(String(branch));
    }

    if (userData.branches && userData.branches.length > 0) {
      setBranches(
        userData.branches.map((b) => ({
          id: b.id || (b as any)._id,
          _id: b.id || (b as any)._id,
          name: b.name,
          code: b.code,
          isMainBranch: b.isMainBranch,
        }))
      );
    }

    // Determine initial portal and landing destination based on role
    let defaultPortal: 'front-desk' | 'back-office' = 'front-desk';
    let targetRoute = '/front-desk/dashboard';

    if (userData.role === 'SUPER_ADMIN' || userData.role === 'ORG_ADMIN') {
      defaultPortal = 'back-office';
      targetRoute = '/back-office/overview';
    } else if (userData.role === 'BRANCH_MANAGER') {
      defaultPortal = 'back-office';
      targetRoute = '/back-office/overview';
    } else if (userData.role === 'STYLIST') {
      defaultPortal = 'front-desk';
      targetRoute = '/stylist/station';
    } else {
      defaultPortal = 'front-desk';
      targetRoute = '/front-desk/dashboard';
    }

    setActivePortal(defaultPortal);
    return targetRoute;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hive_token');
    localStorage.removeItem('hive_user');
    localStorage.removeItem('hive_active_branch');
    localStorage.removeItem('hive_portal');
  };

  const setActiveBranchId = (branchId: string) => {
    setActiveBranchState(branchId);
    localStorage.setItem('hive_active_branch', branchId);
  };

  const setActivePortal = (portal: 'front-desk' | 'back-office') => {
    setActivePortalState(portal);
    localStorage.setItem('hive_portal', portal);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('hive_user', JSON.stringify(res.data.user));
          }
          await refreshBranches();
        } catch (e) {
          logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        branches,
        activeBranchId,
        activePortal,
        isLoading,
        isSuperAdmin,
        isManager,
        isFrontDesk,
        isStylist,
        canAccessBackOffice,
        login,
        logout,
        setActiveBranchId,
        setActivePortal,
        refreshBranches,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
