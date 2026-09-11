'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  CreditCard,
  UserCheck,
  Package,
  Megaphone,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowRightLeft,
  Store,
  Layers,
  Award,
  Wallet,
  Receipt,
  Sparkles,
  MapPin,
  Globe,
  Sliders,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Compass,
  Zap,
  BookOpen,
  Play,
  Briefcase,
  UserCog,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Button,
  Badge,
  Modal,
  Drawer,
  useToast,
  HelpCenterModal,
  QuickActionsMenu,
  ProductTour,
} from '@hive/ui';
import { cn, formatCurrency } from '@hive/utilities';

export interface BackOfficeNavSection {
  title: string;
  items: Array<{
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }>;
}

export const backOfficeNavSections: BackOfficeNavSection[] = [
  {
    title: 'Home',
    items: [
      { id: 'bo-dashboard', label: 'Management Dashboard', href: '/back-office/dashboard', icon: BarChart3 },
    ],
  },
  {
    title: 'Business & Network',
    items: [
      { id: 'bo-organization', label: 'Organization', href: '/back-office/business/organization', icon: Globe },
      { id: 'bo-locations', label: 'Geographical Tree', href: '/back-office/business/locations', icon: MapPin },
      { id: 'bo-branches', label: 'Branches Directory', href: '/back-office/business/branches', icon: Building2 },
    ],
  },
  {
    title: 'Customers & Retention',
    items: [
      { id: 'bo-customers', label: 'Customers 360°', href: '/back-office/customers', icon: Users },
      { id: 'bo-memberships', label: 'Memberships & Passes', href: '/back-office/customers/memberships', icon: Award },
      { id: 'bo-packages', label: 'Service Packages', href: '/back-office/customers/packages', icon: Layers },
      { id: 'bo-wallet', label: 'Wallet Ledgers', href: '/back-office/customers/wallet', icon: Wallet },
      { id: 'bo-loyalty', label: 'Loyalty Rewards', href: '/back-office/customers/loyalty', icon: Sparkles },
    ],
  },
  {
    title: 'Services & Menu',
    items: [
      { id: 'bo-services', label: 'Services Catalog', href: '/back-office/services', icon: Sparkles },
      { id: 'bo-categories', label: 'Categories', href: '/back-office/services/categories', icon: Layers },
      { id: 'bo-pricing', label: 'Pricing & Slabs', href: '/back-office/services/pricing', icon: DollarSign },
      { id: 'bo-addons', label: 'Add-ons & Upgrades', href: '/back-office/services/addons', icon: Sparkles },
      { id: 'bo-recipes', label: 'Service Recipes (BOM)', href: '/back-office/services/recipes', icon: Sliders },
    ],
  },
  {
    title: 'Team & Workforce',
    items: [
      { id: 'bo-staff', label: 'Staff Directory', href: '/back-office/team/staff', icon: UserCheck },
      { id: 'bo-schedule', label: 'Shift Rosters', href: '/back-office/team/schedule', icon: Calendar },
      { id: 'bo-attendance', label: 'Attendance & Biometrics', href: '/back-office/team/attendance', icon: Clock },
      { id: 'bo-leave', label: 'Leave Approvals', href: '/back-office/team/leave', icon: Briefcase },
      { id: 'bo-commissions', label: 'Commissions Engine', href: '/back-office/team/commissions', icon: DollarSign },
      { id: 'bo-targets', label: 'Performance Targets', href: '/back-office/team/targets', icon: TrendingUp },
    ],
  },
  {
    title: 'Inventory & Supply Chain',
    items: [
      { id: 'bo-products', label: 'Products Master', href: '/back-office/inventory/products', icon: Package },
      { id: 'bo-stock', label: 'Stock Ledgers', href: '/back-office/inventory/stock', icon: Layers },
      { id: 'bo-purchases', label: 'Purchase Orders', href: '/back-office/inventory/purchases', icon: Receipt },
      { id: 'bo-vendors', label: 'Vendors CRM', href: '/back-office/inventory/vendors', icon: Users },
      { id: 'bo-transfers', label: 'Branch Transfers', href: '/back-office/inventory/transfers', icon: ArrowRightLeft },
      { id: 'bo-consumption', label: 'Backbar Consumption', href: '/back-office/inventory/consumption', icon: Sliders },
      { id: 'bo-expiry', label: 'Expiry Tracker', href: '/back-office/inventory/expiry', icon: Clock },
    ],
  },
  {
    title: 'Marketing & Reviews',
    items: [
      { id: 'bo-campaigns', label: 'Broadcast Campaigns', href: '/back-office/marketing/campaigns', icon: Megaphone },
      { id: 'bo-automations', label: 'Automations', href: '/back-office/marketing/automations', icon: Zap },
      { id: 'bo-messages', label: 'Message Logs', href: '/back-office/marketing/messages', icon: Receipt },
      { id: 'bo-reviews', label: 'CSAT Reviews', href: '/back-office/marketing/reviews', icon: Award },
    ],
  },
  {
    title: 'Finance & Accounting',
    items: [
      { id: 'bo-revenue', label: 'Revenue Streams', href: '/back-office/finance/revenue', icon: DollarSign },
      { id: 'bo-expenses', label: 'Expense Governance', href: '/back-office/finance/expenses', icon: Receipt },
      { id: 'bo-payments', label: 'Payment Settlements', href: '/back-office/finance/payments', icon: Wallet },
      { id: 'bo-refunds', label: 'Refunds & Adjustments', href: '/back-office/finance/refunds', icon: ArrowRightLeft },
    ],
  },
  {
    title: 'Central Reports & BI',
    items: [
      { id: 'bo-rep-sales', label: 'Sales Reports', href: '/back-office/reports/sales', icon: FileSpreadsheet },
      { id: 'bo-rep-customers', label: 'Customer Reports', href: '/back-office/reports/customers', icon: FileSpreadsheet },
      { id: 'bo-rep-appointments', label: 'Appointment Reports', href: '/back-office/reports/appointments', icon: FileSpreadsheet },
      { id: 'bo-rep-staff', label: 'Staff Reports', href: '/back-office/reports/staff', icon: FileSpreadsheet },
      { id: 'bo-rep-inventory', label: 'Inventory Reports', href: '/back-office/reports/inventory', icon: FileSpreadsheet },
      { id: 'bo-rep-finance', label: 'Financial Statements (P&L)', href: '/back-office/reports/finance', icon: FileSpreadsheet },
      { id: 'bo-rep-comparison', label: 'Branch Comparison', href: '/back-office/reports/branch-comparison', icon: BarChart3 },
    ],
  },
  {
    title: 'Hive Salon AI',
    items: [
      { id: 'bo-ai', label: 'AI Natural Language Copilot', href: '/back-office/ai', icon: Bot, badge: 'Copilot' },
      { id: 'bo-ai-insights', label: 'Strategic Insights', href: '/back-office/ai/insights', icon: Sparkles },
      { id: 'bo-ai-forecasts', label: 'Predictive Forecasts', href: '/back-office/ai/forecasts', icon: TrendingUp },
    ],
  },
  {
    title: 'Administration',
    items: [
      { id: 'bo-users', label: 'Users & Scopes', href: '/back-office/admin/users', icon: UserCog },
      { id: 'bo-roles', label: 'Roles & Permissions', href: '/back-office/admin/roles', icon: ShieldCheck },
      { id: 'bo-settings', label: 'Organization Settings', href: '/back-office/admin/settings', icon: Settings },
      { id: 'bo-audit', label: 'Audit Trail Logs', href: '/back-office/admin/audit', icon: ShieldCheck },
    ],
  },
];

export function BackOfficeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = React.useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = React.useState(false);
  const [isTourOpen, setIsTourOpen] = React.useState(false);

  // Active Session State
  const [userName, setUserName] = React.useState('Dr. Evelyn Montgomery');
  const [userRole, setUserRole] = React.useState('ORGANIZATION_OWNER');
  const [roleTitle, setRoleTitle] = React.useState('Director & Owner');
  const [canSwitchToFrontDesk, setCanSwitchToFrontDesk] = React.useState(true);

  // Geographic Scope Context Filters
  const [selectedState, setSelectedState] = React.useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = React.useState('ALL');
  const [selectedCity, setSelectedCity] = React.useState('ALL');
  const [selectedBranch, setSelectedBranch] = React.useState('ALL');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hive_session');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          setUserName(session.userName || 'Dr. Evelyn Montgomery');
          setUserRole(session.userRole || 'ORGANIZATION_OWNER');
          setRoleTitle(session.roleTitle || 'Director & Owner');
          setCanSwitchToFrontDesk(
            session.userRole === 'ORGANIZATION_OWNER' ||
            session.userRole === 'BRANCH_MANAGER' ||
            session.userRole === 'SUPER_ADMIN' ||
            session.allowedPortals?.includes('FRONT_DESK')
          );
        } catch {}
      }
    }
  }, []);

  // Hotkey listeners: Alt+A (Quick Actions), Alt+H (Help Center), Alt+T (Product Tour)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsQuickActionsOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsHelpCenterOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsTourOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSwitchPortal = () => {
    toast.info('Switching to Front Desk Operations...');
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hive_session');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          session.activePortal = 'FRONT_DESK';
          localStorage.setItem('hive_session', JSON.stringify(session));
        } catch {}
      }
    }
    router.push('/front-desk/dashboard');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hive_session');
    }
    toast.warning('Signed out', 'Session ended successfully.');
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans select-none">
      {/* =====================================================================
          SIDEBAR NAVIGATION (BACK OFFICE SPECIFIC)
      ====================================================================== */}
      <aside
        className={cn(
          'relative flex flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-md transition-all duration-200 select-none z-30 h-screen',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Brand & Portal Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-sky-600 text-slate-950 font-black shadow-md">
                BO
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-black text-white tracking-tight">
                  BACK OFFICE
                </span>
                <span className="truncate text-[10px] font-semibold text-sky-400">
                  Management & ERP Suite
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-slate-950 font-black shadow-md">
              BO
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
          {backOfficeNavSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {section.title}
                </h4>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => router.push(item.href)}
                      className={cn(
                        'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all text-left',
                        isActive
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-md scale-[1.02]'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white',
                        isCollapsed && 'justify-center px-0'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-sky-400'
                        )}
                      />
                      {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.2 text-[9px] font-bold',
                            isActive
                              ? 'bg-slate-950 text-sky-300'
                              : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
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

        {/* User Session & Logout Footer */}
        <div className="border-t border-slate-800 p-3 space-y-2">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                    {userName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="truncate text-xs font-bold text-white">{userName}</span>
                    <span className="truncate text-[10px] text-sky-400">{roleTitle}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {canSwitchToFrontDesk && (
                <button
                  type="button"
                  onClick={handleSwitchPortal}
                  className="w-full py-1.5 px-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Front Desk</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 text-slate-400 hover:text-rose-400"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* =====================================================================
          MAIN BACK OFFICE VIEWPORT
      ====================================================================== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Management Header Ribbon with 5-Tier Geographic Scope */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 gap-4 shadow-xs">
          {/* Prominent Geographic Hierarchy Breadcrumb & Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-bold text-slate-900">Hive Beauty Group</span>
              <span className="text-slate-400">›</span>
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs text-sky-700 font-semibold focus:outline-none focus:bg-white"
            >
              <option value="ALL">All States (2)</option>
              <option value="Telangana">Telangana</option>
              <option value="Karnataka">Karnataka</option>
            </select>

            <span className="text-slate-400">›</span>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs text-sky-700 font-semibold focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Cities (2)</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>

            <span className="text-slate-400">›</span>

            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                toast.success(`Filter updated to ${e.target.value}`);
              }}
              className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 text-xs text-amber-900 font-bold focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Branches (4 Locations)</option>
              <option value="JH-01">Jubilee Hills Flagship (JH-01)</option>
              <option value="BH-02">Banjara Hills Spa (BH-02)</option>
              <option value="HC-03">Hitech City Express (HC-03)</option>
              <option value="IN-01">Indiranagar Sanctuary (IN-01)</option>
            </select>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHelpCenterOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Help Center</span>
              <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-1 rounded border border-slate-200">Alt+H</span>
            </button>

            <button
              onClick={() => router.push('/back-office/ai')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Bot className="w-3.5 h-3.5 text-purple-200" />
              <span className="hidden sm:inline">Hive AI</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Global Quick Actions Speed Dial */}
      <QuickActionsMenu
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onActionClick={(href) => {
          setIsQuickActionsOpen(false);
          router.push(href);
        }}
      />

      {/* Searchable Help Center Modal */}
      <HelpCenterModal
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
        onNavigate={(href) => {
          setIsHelpCenterOpen(false);
          router.push(href);
        }}
      />

      {/* Interactive Product Tour */}
      <ProductTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}
