'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@hive/ui';
import { FrontDeskShell } from './front-desk-shell';
import { BackOfficeShell } from './back-office-shell';

// Route classifiers for portal shell delegation
const FRONT_DESK_PATHS = [
  '/front-desk',
  '/appointments',
  '/pos',
  '/orders',
  '/portal',
  '/showcase',
];

const BACK_OFFICE_PATHS = [
  '/back-office',
  '/branches',
  '/users',
  '/roles',
  '/staff',
  '/commissions',
  '/inventory',
  '/marketing',
  '/finance',
  '/ai',
  '/settings',
  '/audit',
  '/services',
  '/memberships',
  '/customers',
];

function ShellRouter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  // Auth screen and root router render full screen without portal shells
  if (pathname === '/login' || pathname === '/') {
    return <>{children}</>;
  }

  // Front Desk Workspace (/front-desk/*)
  if (pathname.startsWith('/front-desk') || FRONT_DESK_PATHS.some((p) => pathname.startsWith(p))) {
    return <FrontDeskShell>{children}</FrontDeskShell>;
  }

  // Back Office Workspace (/back-office/*)
  if (pathname.startsWith('/back-office') || BACK_OFFICE_PATHS.some((p) => pathname.startsWith(p))) {
    return <BackOfficeShell>{children}</BackOfficeShell>;
  }

  // Fallback to Front Desk workspace
  return <FrontDeskShell>{children}</FrontDeskShell>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ShellRouter>{children}</ShellRouter>
    </ToastProvider>
  );
}
