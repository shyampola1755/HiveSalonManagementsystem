'use client';

import * as React from 'react';
import {
  Calendar,
  Users,
  CreditCard,
  Package,
  UserCheck,
  Building2,
  BarChart3,
  Settings,
  Sparkles,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  MapPin,
  Lock,
  KeyRound,
  DollarSign,
  Award,
  Megaphone,
  ShoppingBag,
  Bot,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '@hive/utilities';

export interface NavSection {
  title?: string;
  items: Array<{
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeVariant?: 'default' | 'success' | 'warning';
  }>;
}

export interface SideNavigationProps {
  currentPath?: string;
  onNavigate?: (href: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  organizationName?: string;
  branchName?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  className?: string;
}

export const defaultNavigationSections: NavSection[] = [
  {
    title: 'Operations',
    items: [
      { id: 'ai', label: 'Hive Salon AI (BI)', href: '/ai', icon: Bot, badge: 'Phase 16' },
      { id: 'appointments', label: 'Appointment Diary', href: '/appointments', icon: Calendar, badge: 'Phase 6' },
      { id: 'orders', label: 'Retail Orders & E-Com', href: '/orders', icon: ShoppingBag, badge: 'Phase 15' },
      { id: 'portal', label: 'Guest Portal & Booking', href: '/portal', icon: Sparkles, badge: 'Phase 14' },
      { id: 'pos', label: 'Point of Sale (POS)', href: '/pos', icon: CreditCard, badge: 'Phase 7' },
      { id: 'finance', label: 'Finance & Central Reports', href: '/finance', icon: BarChart3, badge: 'Phase 13' },
      { id: 'marketing', label: 'Marketing & Reviews', href: '/marketing', icon: Megaphone, badge: 'Phase 12' },
      { id: 'memberships', label: 'Retention & Memberships', href: '/memberships', icon: Award, badge: 'Phase 11' },
      { id: 'customers', label: 'Customers CRM', href: '/customers', icon: Users, badge: 'Phase 4' },
      { id: 'services', label: 'Services Catalog', href: '/services', icon: Sparkles, badge: 'Phase 5' },
      { id: 'inventory', label: 'Inventory & Stock', href: '/inventory', icon: Package, badge: 'Phase 8' },
    ],
  },
  {
    title: 'Locations & Network',
    items: [
      { id: 'hierarchy', label: 'Geographical Tree', href: '/branches/hierarchy', icon: MapPin, badge: 'Phase 2' },
      { id: 'branches', label: 'Branches Directory', href: '/branches', icon: Building2 },
    ],
  },
  {
    title: 'Team & Access Control',
    items: [
      { id: 'users', label: 'Users & Scopes', href: '/users', icon: Users, badge: 'Phase 3' },
      { id: 'roles', label: 'Roles & Permissions', href: '/roles', icon: Lock },
      { id: 'staff', label: 'Staff & Rosters', href: '/staff', icon: UserCheck, badge: 'Phase 9' },
      { id: 'commissions', label: 'Commissions & Targets', href: '/commissions', icon: DollarSign, badge: 'Phase 10' },
    ],
  },
  {
    title: 'System & Foundation',
    items: [
      { id: 'showcase', label: 'UX Design System', href: '/showcase', icon: Compass },
      { id: 'audit', label: 'Audit Trail Logs', href: '/audit', icon: ShieldCheck },
      { id: 'settings', label: 'Organization Settings', href: '/settings', icon: Settings },
    ],
  },
];

export const SideNavigation: React.FC<SideNavigationProps> = ({
  currentPath = '/',
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  organizationName = 'Hive Beauty Group',
  branchName = 'Telangana / Hyderabad / Jubilee Hills',
  userName = 'Sarah Jenkins',
  userRole = 'BRANCH_MANAGER',
  className,
}) => {
  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 select-none z-30 h-screen',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Brand & Organization Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white font-bold shadow-sm">
              H
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                {organizationName}
              </span>
              <span className="truncate text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                {branchName}
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white font-bold shadow-sm">
            H
          </div>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {defaultNavigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && section.title && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </h4>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate?.(item.href)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all text-left',
                      isActive
                        ? 'bg-amber-500 text-white font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100',
                      isCollapsed && 'justify-center px-0'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      )}
                    />
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.2 text-[9px] font-bold',
                          isActive
                            ? 'bg-amber-700 text-white'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300">
              {userName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {userName}
              </span>
              <span className="truncate text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                {userRole}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300">
              {userName.split(' ').map((n) => n[0]).join('')}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
