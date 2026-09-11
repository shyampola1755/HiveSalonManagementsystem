'use client';

import * as React from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  HelpCircle,
  Building2,
  ChevronDown,
  Sparkles,
  CalendarPlus,
  UserPlus,
  Receipt,
  LogOut,
  Settings,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { Button } from './button';
import { Dropdown } from './dropdown';
import { Tooltip } from './tooltip';
import { Badge } from './badge';
import { cn } from '@hive/utilities';

export interface HierarchicalBranchOption {
  id: string;
  name: string;
  code: string;
  stateName?: string;
  cityName?: string;
  districtName?: string;
  isMain?: boolean;
}

export interface TopNavigationProps {
  onToggleMobileMenu?: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenHelp?: () => void;
  branches?: HierarchicalBranchOption[];
  currentBranchId?: string;
  onSwitchBranch?: (branchId: string) => void;
  notificationCount?: number;
  onOpenWizard?: () => void;
  onQuickAction?: (actionKey: string) => void;
  userName?: string;
  userRole?: string;
  organizationName?: string;
  className?: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onToggleMobileMenu,
  onOpenGlobalSearch,
  onOpenHelp,
  branches = [
    {
      id: 'b1',
      name: 'Jubilee Hills Flagship',
      code: 'JH-01',
      stateName: 'Telangana',
      cityName: 'Hyderabad',
      isMain: true,
    },
    {
      id: 'b2',
      name: 'Banjara Hills Spa & Lounge',
      code: 'BH-02',
      stateName: 'Telangana',
      cityName: 'Hyderabad',
    },
    {
      id: 'b3',
      name: 'Hitech City Express',
      code: 'HC-03',
      stateName: 'Telangana',
      cityName: 'Hyderabad',
    },
    {
      id: 'b4',
      name: 'Indiranagar Sanctuary',
      code: 'IN-01',
      stateName: 'Karnataka',
      cityName: 'Bengaluru',
    },
  ],
  currentBranchId = 'b1',
  onSwitchBranch,
  notificationCount = 3,
  onOpenWizard,
  onQuickAction,
  userName = 'Sarah Jenkins',
  userRole = 'BRANCH_MANAGER',
  organizationName = 'Hive Beauty Group',
  className,
}) => {
  const currentBranch = branches.find((b) => b.id === currentBranchId) || branches[0];

  const branchMenuItems = branches.map((b) => ({
    id: b.id,
    label: (
      <div className="flex flex-col text-left py-0.5">
        <div className="flex items-center justify-between w-full gap-2">
          <span className="font-bold text-xs">{b.name}</span>
          {b.isMain && (
            <span className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
              HQ
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-400">
          {organizationName} • {b.cityName || 'City'} • {b.code}
        </span>
      </div>
    ),
    icon: <Building2 className="h-4 w-4 text-amber-500" />,
    onClick: () => onSwitchBranch?.(b.id),
  }));

  const quickActionItems = [
    {
      id: 'new_appointment',
      label: 'New Appointment',
      icon: <CalendarPlus className="h-4 w-4 text-amber-500" />,
      onClick: () => onQuickAction?.('new_appointment'),
    },
    {
      id: 'new_customer',
      label: 'New Customer',
      icon: <UserPlus className="h-4 w-4 text-emerald-500" />,
      onClick: () => onQuickAction?.('new_customer'),
    },
    {
      id: 'new_sale',
      label: 'Quick Sale / Invoice',
      icon: <Receipt className="h-4 w-4 text-sky-500" />,
      onClick: () => onQuickAction?.('new_sale'),
    },
  ];

  const userMenuItems = [
    {
      id: 'profile',
      label: `${userName} (${userRole})`,
      icon: <ShieldCheck className="h-4 w-4 text-amber-500" />,
      onClick: () => {},
    },
    {
      id: 'wizard',
      label: 'Onboarding Setup Wizard',
      icon: <Sparkles className="h-4 w-4 text-amber-500" />,
      onClick: () => onOpenWizard?.(),
    },
    {
      id: 'settings',
      label: 'Organization Settings',
      icon: <Settings className="h-4 w-4 text-slate-400" />,
      onClick: () => onQuickAction?.('settings'),
    },
    {
      id: 'audit',
      label: 'Audit Trail Logs',
      icon: <ShieldCheck className="h-4 w-4 text-slate-400" />,
      onClick: () => onQuickAction?.('audit'),
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: <LogOut className="h-4 w-4 text-rose-500" />,
      destructive: true,
      onClick: () => onQuickAction?.('logout'),
    },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md transition-all',
        className
      )}
    >
      {/* Left: Mobile Menu & Hierarchical Branch Switcher */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Hierarchical Branch Switcher */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 hover:border-amber-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer">
              <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-medium leading-none">
                  {organizationName} {currentBranch.cityName ? `• ${currentBranch.cityName}` : ''}
                </span>
                <span className="font-bold text-xs truncate max-w-[140px] sm:max-w-[220px] mt-0.5">
                  {currentBranch.name}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
            </div>
          }
          items={branchMenuItems}
        />
      </div>

      {/* Right Area: Global Search, Quick Actions, Help, Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        {onOpenGlobalSearch && (
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 transition-all sm:w-64"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search anything...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="ml-auto hidden rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 sm:inline">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Quick Action (+) */}
        <Dropdown
          trigger={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              className="rounded-xl px-3"
            >
              <span className="hidden sm:inline">Quick Action</span>
            </Button>
          }
          items={quickActionItems}
          align="right"
        />

        {/* Setup Wizard */}
        {onOpenWizard && (
          <Tooltip content="Setup Progress: 80% (Click to resume)">
            <button
              type="button"
              onClick={onOpenWizard}
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin-slow" />
              <span>Setup (80%)</span>
            </button>
          </Tooltip>
        )}

        {/* Help Button */}
        {onOpenHelp && (
          <Tooltip content="Contextual Help & Guides (Ctrl + /)" shortcut="Ctrl+/">
            <button
              type="button"
              onClick={onOpenHelp}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Help System"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </Tooltip>
        )}

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar Menu */}
        <Dropdown
          trigger={
            <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-xs hover:ring-2 hover:ring-amber-500/40 transition-all dark:bg-slate-100 dark:text-slate-900">
              {userName.split(' ').map((n) => n[0]).join('')}
            </div>
          }
          items={userMenuItems}
          align="right"
        />
      </div>
    </header>
  );
};
