import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
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
  const navigate = useNavigate();

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
    branchList.find((b) => String(b.id || (b as any)._id) === String(activeBranchId))?.name ||
    branchList[0]?.name ||
    'Hyderabad Flagship';

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Header */}
        <header className="h-16 glass-header sticky top-0 z-30 px-6 flex items-center justify-between">
          {/* Portal Switcher Buttons (or role-specific portal pill) */}
          <div className="flex items-center gap-3">
            {canAccessBackOffice ? (
              <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner">
                <button
                  onClick={() => handlePortalSwitch('front-desk')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePortal === 'front-desk'
                      ? 'bg-brand-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Front Desk & POS
                </button>
                <button
                  onClick={() => handlePortalSwitch('back-office')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePortal === 'back-office'
                      ? 'bg-brand-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {isManager ? 'Branch Operations Hub' : 'Back Office ERP'}
                </button>
              </div>
            ) : isStylist ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold">
                <Scissors className="w-3.5 h-3.5 text-rose-400" />
                Stylist Workstation
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Front Desk Operations & POS
              </div>
            )}
          </div>

          {/* Right Header Utilities: Branch Selector & Profile */}
          <div className="flex items-center gap-4">
            {/* Branch Selector / Display */}
            {isSuperAdmin ? (
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-brand-400 absolute left-3 pointer-events-none" />
                <select
                  value={activeBranchId || ''}
                  onChange={(e) => setActiveBranchId(e.target.value)}
                  className="bg-slate-950/70 border border-slate-800 text-xs font-medium rounded-xl pl-9 pr-8 py-2 text-slate-200 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer hover:border-slate-700 transition-colors"
                >
                  {branchList.map((b) => {
                    const bId = String(b.id || (b as any)._id);
                    return (
                      <option key={bId} value={bId}>
                        {b.name}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="truncate max-w-[220px]">{activeBranchName}</span>
              </div>
            )}

            {/* Quick POS Action Shortcut (For Front Desk, Manager & Admin) */}
            {!isStylist && (
              <button
                onClick={() => navigate('/front-desk/pos')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                New Sale
              </button>
            )}

            {/* User Profile & Role Pill */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-semibold text-slate-200">{user?.fullName || 'User'}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isSuperAdmin
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : isManager
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isStylist
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {user?.role?.replace('_', ' ') || 'Staff'}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Portal Page Route Outlet */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
