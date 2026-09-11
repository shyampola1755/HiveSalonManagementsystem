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
  role: string;
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
  login: (token: string, userData: User) => void;
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
    return (localStorage.getItem('hive_portal') as any) || 'front-desk';
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('hive_token', newToken);
    localStorage.setItem('hive_user', JSON.stringify(userData));

    const branch = userData.primaryBranchId || (userData.branches && userData.branches[0]?.id);
    if (branch) {
      setActiveBranchId(String(branch));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hive_token');
    localStorage.removeItem('hive_user');
    localStorage.removeItem('hive_active_branch');
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
          // Token expired or invalid
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
