import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface UserBranch {
  id: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hive_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hive_token'));

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

  const login = (newToken: string, userData: User): string => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('hive_token', newToken);
    localStorage.setItem('hive_user', JSON.stringify(userData));

    const branch = userData.primaryBranchId || (userData.branches && userData.branches[0]?.id);
    if (branch) {
      setActiveBranchId(String(branch));
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
