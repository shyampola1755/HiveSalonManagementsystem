'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  CreditCard,
  UserCheck,
  Building2,
  Settings,
  Sparkles,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  Zap,
  CheckCircle2,
  Clock,
  LogOut,
  ArrowRightLeft,
  Store,
  Layers,
  Award,
  Wallet,
  Receipt,
  RotateCcw,
  Check,
  UserPlus,
  Play,
  BookOpen,
} from 'lucide-react';
import {
  Button,
  Badge,
  Input,
  Modal,
  Drawer,
  useToast,
  HelpCenterModal,
  QuickActionsMenu,
  ProductTour,
} from '@hive/ui';
import { cn, formatCurrency } from '@hive/utilities';
import { DUAL_PORTAL_ROLES } from '@hive/auth';

export interface FrontDeskNavSection {
  title: string;
  items: Array<{
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }>;
}

export const frontDeskNavSections: FrontDeskNavSection[] = [
  {
    title: 'Home',
    items: [
      { id: 'fd-dashboard', label: 'Dashboard', href: '/front-desk/dashboard', icon: Store },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'fd-appointments', label: 'Appointments', href: '/front-desk/appointments', icon: Calendar, badge: 'Live' },
      { id: 'fd-calendar', label: 'Calendar', href: '/front-desk/calendar', icon: Clock },
      { id: 'fd-queue', label: 'Queue', href: '/front-desk/queue', icon: Layers },
      { id: 'fd-checkin', label: 'Check-in', href: '/front-desk/checkin', icon: UserCheck },
    ],
  },
  {
    title: 'Customers',
    items: [
      { id: 'fd-customers', label: 'Customers', href: '/front-desk/customers', icon: Users },
      { id: 'fd-history', label: 'Customer History', href: '/front-desk/customers/history', icon: Sparkles },
    ],
  },
  {
    title: 'Sales & Billing',
    items: [
      { id: 'fd-pos', label: 'POS Terminal', href: '/front-desk/pos', icon: CreditCard, badge: 'Fast-Lane' },
      { id: 'fd-invoices', label: 'Invoices', href: '/front-desk/invoices', icon: Receipt },
      { id: 'fd-payments', label: 'Payments', href: '/front-desk/payments', icon: Wallet },
    ],
  },
  {
    title: 'Customer Benefits',
    items: [
      { id: 'fd-memberships', label: 'Memberships', href: '/front-desk/memberships', icon: Award },
      { id: 'fd-packages', label: 'Packages', href: '/front-desk/packages', icon: Layers },
      { id: 'fd-wallet', label: 'Wallet Credits', href: '/front-desk/wallet', icon: Wallet },
      { id: 'fd-loyalty', label: 'Loyalty Points', href: '/front-desk/loyalty', icon: Sparkles },
    ],
  },
];

export function FrontDeskShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = React.useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = React.useState(false);
  const [isReceptionistGuideOpen, setIsReceptionistGuideOpen] = React.useState(false);
  const [isTourOpen, setIsTourOpen] = React.useState(false);

  // Active Session State
  const [userName, setUserName] = React.useState('Sarah Jenkins');
  const [userRole, setUserRole] = React.useState('FRONT_DESK');
  const [roleTitle, setRoleTitle] = React.useState('Front Desk Lead');
  const [activeBranchName, setActiveBranchName] = React.useState('Jubilee Hills Flagship (JH-01)');
  const [canSwitchToBackOffice, setCanSwitchToBackOffice] = React.useState(false);

  // Global Quick Mobile Customer Search State
  const [mobileSearchQuery, setMobileSearchQuery] = React.useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [foundCustomer, setFoundCustomer] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hive_session');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          setUserName(session.userName || 'Sarah Jenkins');
          setUserRole(session.userRole || 'FRONT_DESK');
          setRoleTitle(session.roleTitle || 'Front Desk Lead');
          setActiveBranchName(session.activeBranchName ? `${session.activeBranchName} (${session.activeBranchCode || 'JH-01'})` : 'Jubilee Hills Flagship (JH-01)');
          setCanSwitchToBackOffice(
            session.userRole === 'ORGANIZATION_OWNER' ||
            session.userRole === 'BRANCH_MANAGER' ||
            session.userRole === 'SUPER_ADMIN' ||
            session.allowedPortals?.includes('BACK_OFFICE')
          );
        } catch {
          // Default state remains
        }
      }
    }
  }, []);

  // Hotkey listeners: Alt+A (Quick Actions), Alt+R (Receptionist Guide), Alt+H (Help), Alt+T (Tour), Ctrl+K (Customer Search)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('front-desk-mobile-search');
        searchInput?.focus();
      }
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsQuickActionsOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsReceptionistGuideOpen((prev) => !prev);
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

  const handleMobileLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileSearchQuery.trim()) return;

    // Simulate instant customer lookup
    const mockFound = {
      fullName: 'Priya Sharma',
      phone: '+91 98765 43210',
      lastVisit: 'Sep 2, 2026 (8 days ago)',
      nextAppointment: 'Today @ 03:30 PM (Balayage)',
      membershipTier: 'Royal Diamond Club (20% Off)',
      walletBalance: 4200.0,
      loyaltyPoints: 850,
      allergies: 'Ammonia-sensitive scalp',
    };

    setFoundCustomer(mockFound);
    setIsCustomerModalOpen(true);
  };

  const handleSwitchPortal = () => {
    if (!canSwitchToBackOffice) {
      toast.error('Access Restricted', 'Your role does not have authorization to access Back Office administration.');
      return;
    }
    toast.info('Switching to Back Office Workspace...');
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hive_session');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          session.activePortal = 'BACK_OFFICE';
          localStorage.setItem('hive_session', JSON.stringify(session));
        } catch {}
      }
    }
    router.push('/back-office/dashboard');
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
          SIDEBAR NAVIGATION (FRONT DESK SPECIFIC)
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black shadow-md">
                FD
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-black text-white tracking-tight">
                  FRONT DESK
                </span>
                <span className="truncate text-[10px] font-semibold text-amber-400">
                  Salon Daily Operations
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shadow-md">
              FD
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
          {frontDeskNavSections.map((section, idx) => (
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
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-[1.02]'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white',
                        isCollapsed && 'justify-center px-0'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'
                        )}
                      />
                      {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.2 text-[9px] font-bold',
                            isActive
                              ? 'bg-slate-950 text-amber-300'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                    {userName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="truncate text-xs font-bold text-white">{userName}</span>
                    <span className="truncate text-[10px] text-amber-400">{roleTitle}</span>
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

              {canSwitchToBackOffice && (
                <button
                  type="button"
                  onClick={handleSwitchPortal}
                  className="w-full py-1.5 px-2.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
                  <span>Switch to Back Office</span>
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
          MAIN OPERATIONAL VIEWPORT
      ====================================================================== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Front Desk Header Bar */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 gap-4 shadow-xs">
          {/* Fast Mobile Lookup Bar */}
          <div className="flex-1 max-w-md">
            <form onSubmit={handleMobileLookup} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="front-desk-mobile-search"
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Lookup guest by 10-digit mobile number (e.g. 9876543210)... [Ctrl+K]"
                className="w-full h-10 pl-9 pr-20 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors shadow-xs"
              >
                Find
              </button>
            </form>
          </div>

          {/* Right Header Ribbon */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-slate-900">{activeBranchName}</span>
            </div>

            <button
              onClick={() => setIsReceptionistGuideOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Receptionist SOP</span>
              <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-1 rounded border border-slate-200">Alt+R</span>
            </button>

            <button
              onClick={() => setIsQuickActionsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Actions</span>
              <span className="font-mono text-[9px] text-slate-950/70 bg-amber-600/30 px-1 rounded">Alt+A</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* =====================================================================
          CUSTOMER LOOKUP RESULT MODAL
      ====================================================================== */}
      {isCustomerModalOpen && foundCustomer && (
        <Modal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          title={`Guest Profile: ${foundCustomer.fullName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-left text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{foundCustomer.fullName}</h3>
                  <span className="text-slate-500 font-mono text-[11px]">{foundCustomer.phone}</span>
                </div>
                <Badge variant="warning" className="text-[10px]">
                  {foundCustomer.membershipTier}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Last Visit</span>
                  <span className="text-slate-800 font-semibold">{foundCustomer.lastVisit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Next Appointment</span>
                  <span className="text-amber-700 font-semibold">{foundCustomer.nextAppointment}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Prepaid Wallet</span>
                  <span className="text-emerald-700 font-bold">{formatCurrency(foundCustomer.walletBalance)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Loyalty Points</span>
                  <span className="text-amber-700 font-bold">{foundCustomer.loyaltyPoints} Pts</span>
                </div>
              </div>

              {foundCustomer.allergies && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-medium">
                  ⚠️ Alert: {foundCustomer.allergies}
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  router.push('/front-desk/appointments');
                  toast.success(`Booking appointment for ${foundCustomer.fullName}`);
                }}
              >
                Book Appointment
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  router.push('/front-desk/pos');
                  toast.success(`Started POS sale for ${foundCustomer.fullName}`);
                }}
              >
                Start Sale / POS
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  router.push('/front-desk/checkin');
                  toast.success(`${foundCustomer.fullName} checked in to active queue.`);
                }}
              >
                Check-in Guest
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  router.push('/front-desk/customers');
                }}
              >
                View 360° History
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Receptionist 9-Step Zero-Training SOP Drawer */}
      <Drawer
        isOpen={isReceptionistGuideOpen}
        onClose={() => setIsReceptionistGuideOpen(false)}
        title="Receptionist 9-Step Zero-Training Workflow"
        position="right"
        width="md"
      >
        <div className="p-4 space-y-4 text-xs text-left">
          <p className="text-slate-400 leading-relaxed">
            Follow this 9-step SOP for every client visit to guarantee flawless daily salon operations.
          </p>

          <div className="space-y-3">
            {[
              { step: '1. Find Customer', desc: 'Type 10-digit mobile in the top search bar (Ctrl+K).' },
              { step: '2. Create Appointment', desc: 'Select Service, Stylist & Slot if guest is booking advance visit.' },
              { step: '3. Check-in Client', desc: 'Mark guest as ARRIVED on the queue board upon physical arrival.' },
              { step: '4. Assign Stylist', desc: 'Confirm master stylist or aesthetician is ready at station.' },
              { step: '5. Complete Service', desc: 'Stylist performs hair/skin ritual; backbar items deduct automatically.' },
              { step: '6. Create Bill (POS)', desc: 'Open POS checkout; add any retail homecare products taken.' },
              { step: '7. Apply Benefits', desc: 'Auto-apply VIP 20% discount, loyalty point credits, or wallet balance.' },
              { step: '8. Take Payment', desc: 'Accept UPI QR, Card swipe, Cash, or Split tender.' },
              { step: '9. Send Receipt & Rebook', desc: 'Dispatches instant WhatsApp receipt and books next visit.' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="font-bold text-amber-400 block">{item.step}</span>
                <span className="text-[11px] text-slate-300">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Drawer>

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
