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

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Navigation - preserved exact dark styling */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Header */}
        <header className="h-16 glass-header sticky top-0 z-30 px-6 flex items-center justify-between">
          {/* Portal Switcher Buttons (or role-specific portal pill) */}
          <div className="flex items-center gap-3">
            {canAccessBackOffice ? (
              <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-inner">
                <button
                  onClick={() => handlePortalSwitch('front-desk')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePortal === 'front-desk'
                      ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Front Desk & POS
                </button>
                <button
                  onClick={() => handlePortalSwitch('back-office')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePortal === 'back-office'
                      ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {isManager ? 'Branch Operations Hub' : 'Back Office ERP'}
                </button>
              </div>
            ) : isStylist ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <Scissors className="w-3.5 h-3.5 text-rose-600" />
                Stylist Workstation
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Front Desk Operations & POS
              </div>
            )}
          </div>

          {/* Right Header Utilities: Branch Selector & Profile */}
          <div className="flex items-center gap-4">
            {/* Interactive Multi-Branch Selector Dropdown */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                  isBranchDropdownOpen
                    ? 'bg-amber-50/80 border-brand-400 text-slate-900 ring-2 ring-brand-400/20'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title="Click to switch active branch location"
              >
                <div className="w-5 h-5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-brand-600 shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="truncate max-w-[180px] sm:max-w-[240px] font-bold text-slate-900">
                  {activeBranchName}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isBranchDropdownOpen ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>

              {/* Floating Dropdown Menu */}
              {isBranchDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
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
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
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

            {/* Quick POS Action Shortcut (For Front Desk, Manager & Admin) */}
            {!isStylist && (
              <button
                onClick={() => navigate('/front-desk/pos')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                New Sale
              </button>
            )}

            {/* User Profile & Role Pill */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-semibold text-slate-800">{user?.fullName || 'User'}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Portal Page Route Outlet */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
