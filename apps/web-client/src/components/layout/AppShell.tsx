import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  LogOut,
  Sparkles,
  Search,
  Bell,
  ChevronDown,
  Layers,
  ShoppingBag,
  ShieldCheck,
  User,
  Scissors,
  Check,
  MapPin,
  Menu,
  Calendar,
  LayoutDashboard,
  UserCheck,
  CreditCard,
  BarChart3,
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const {
    user,
    logout,
    branches,
    activeBranchId,
    setActiveBranchId,
    activePortal,
    setActivePortal,
    canAccessBackOffice,
    isSuperAdmin,
    isManager,
    isFrontDesk,
    isStylist,
  } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside listener for branch dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePortalSwitch = (portal: 'front-desk' | 'back-office') => {
    if (portal === 'back-office' && !canAccessBackOffice) {
      return;
    }
    setActivePortal(portal);
    if (portal === 'front-desk') {
      navigate('/front-desk/dashboard');
    } else {
      navigate('/back-office/overview');
    }
  };

  const branchList = branches && branches.length > 0 ? branches : [
    { id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01' },
    { id: 'mum-01', name: 'Mumbai Salon & Spa (Bandra West)', code: 'MUM-01' },
    { id: 'blr-01', name: 'Bangalore Lounge (Indiranagar)', code: 'BLR-01' },
  ];

  const activeBranchName =
    branchList.find((b) => String(b.id || (b as any)._id) === String(activeBranchId) || b.code === activeBranchId)?.name ||
    branchList[0]?.name ||
    'Hyderabad Flagship';

  const handleSelectBranch = (bId: string, bName: string) => {
    setActiveBranchId(bId);
    setIsBranchDropdownOpen(false);
    showToast(`Switched active branch to ${bName}`, 'info');
  };

  // Mobile Bottom Navigation Tabs based on role & active portal
  const getMobileNavTabs = () => {
    if (isStylist) {
      return [
        { label: 'Station', path: '/stylist/station', icon: Scissors },
        { label: 'Schedule', path: '/front-desk/calendar', icon: Calendar },
        { label: 'Queue', path: '/front-desk/queue', icon: UserCheck },
        { label: 'CRM', path: '/front-desk/customers', icon: User },
      ];
    }
    if (isFrontDesk || activePortal === 'front-desk') {
      return [
        { label: 'Dashboard', path: '/front-desk/dashboard', icon: LayoutDashboard },
        { label: 'Calendar', path: '/front-desk/calendar', icon: Calendar },
        { label: 'POS Billing', path: '/front-desk/pos', icon: CreditCard },
        { label: 'Live Queue', path: '/front-desk/queue', icon: UserCheck },
      ];
    }
    if (isManager) {
      return [
        { label: 'Floor Hub', path: '/back-office/overview', icon: BarChart3 },
        { label: 'Staff Roster', path: '/back-office/team', icon: User },
        { label: 'POS Register', path: '/front-desk/pos', icon: CreditCard },
        { label: 'Inventory', path: '/back-office/inventory', icon: ShoppingBag },
      ];
    }
    // Super Admin
    return [
      { label: 'Executive BI', path: '/back-office/overview', icon: BarChart3 },
      { label: 'Branches', path: '/back-office/branches', icon: Building2 },
      { label: 'POS Register', path: '/front-desk/pos', icon: CreditCard },
      { label: 'Staff Roster', path: '/back-office/team', icon: User },
    ];
  };

  const mobileTabs = getMobileNavTabs();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Navigation - responsive with mobile drawer */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Header */}
        <header className="h-16 glass-header sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Drawer Hamburger & Portal Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile & Tablet (< lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Logo Icon (< sm) */}
            <div className="sm:hidden flex items-center gap-1.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
                H
              </div>
            </div>

            {/* Portal Switcher Buttons (or role-specific portal pill) */}
            {canAccessBackOffice ? (
              <div className="bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 flex items-center gap-0.5 sm:gap-1 shadow-inner shrink-0">
                <button
                  onClick={() => handlePortalSwitch('front-desk')}
                  className={`flex items-center gap-1 sm:gap-2 px-1.5 xs:px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                    activePortal === 'front-desk'
                      ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Front Desk & POS Portal"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">Front Desk</span>
                </button>
                <button
                  onClick={() => handlePortalSwitch('back-office')}
                  className={`flex items-center gap-1 sm:gap-2 px-1.5 xs:px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                    activePortal === 'back-office'
                      ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Back-Office Management Hub"
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">{isManager ? 'Operations Hub' : 'Back Office'}</span>
                </button>
              </div>
            ) : isStylist ? (
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] sm:text-xs font-bold whitespace-nowrap">
                <Scissors className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Stylist Workstation</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>Front Desk Operations</span>
              </div>
            )}
          </div>

          {/* Right Header Utilities: Branch Selector & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Interactive Multi-Branch Selector Dropdown */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all shadow-sm max-w-[130px] xs:max-w-[170px] sm:max-w-none ${
                  isBranchDropdownOpen
                    ? 'bg-amber-50/80 border-brand-400 text-slate-900 ring-2 ring-brand-400/20'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title="Click to switch active branch location"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-brand-600 shrink-0">
                  <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="truncate max-w-[60px] xs:max-w-[100px] sm:max-w-[180px] md:max-w-[240px] font-bold text-slate-900">
                  {activeBranchName}
                </span>
                <ChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isBranchDropdownOpen ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>

              {/* Floating Dropdown Menu */}
              {isBranchDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Salon Branch Location
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Switch localized register, live queue & bookings
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                    {branchList.map((b) => {
                      const bId = String(b.id || (b as any)._id);
                      const isCurrent =
                        String(activeBranchId) === bId ||
                        b.code === activeBranchId ||
                        (!activeBranchId && b.isMainBranch);
                      return (
                        <button
                          key={bId}
                          type="button"
                          onClick={() => handleSelectBranch(bId, b.name)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                            isCurrent
                              ? 'bg-amber-50 border border-amber-200/90 text-slate-950 font-bold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? 'bg-brand-500 text-slate-950 font-extrabold shadow-xs'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-900">{b.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{b.code || 'MAIN'}</div>
                            </div>
                          </div>
                          {isCurrent && (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick POS Action Shortcut (Hidden on small mobile, visible on sm+) */}
            {!isStylist && (
              <button
                onClick={() => navigate('/front-desk/pos')}
                className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                New Sale
              </button>
            )}

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 sm:gap-2.5 pl-1 sm:pl-2 border-l border-slate-200">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-brand-400 to-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-800 truncate max-w-[120px]">{user?.fullName || 'User'}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isSuperAdmin
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : isManager
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : isStylist
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-sky-100 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {user?.role?.replace('_', ' ') || 'Staff'}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Portal Page Route Outlet with responsive padding */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 pb-24 lg:pb-6 overflow-y-auto bg-slate-50 min-w-0">
          <Outlet />
        </main>

        {/* Mobile & Tablet Bottom Quick Navigation Bar (< lg) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-brand-700 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
          {/* More Menu Drawer Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-900 font-medium"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
