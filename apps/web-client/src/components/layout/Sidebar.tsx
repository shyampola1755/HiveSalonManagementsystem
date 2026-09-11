import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  UserCheck,
  Receipt,
  Gift,
  Award,
  Scissors,
  Layers,
  ShoppingBag,
  Send,
  DollarSign,
  BarChart3,
  Settings,
  Building2,
  Sparkles,
  ClipboardList,
  Clock,
  FlaskConical,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, activePortal, isSuperAdmin, isManager, isFrontDesk, isStylist } = useAuth();

  // Navigation configurations based on role & portal
  const getNavItems = () => {
    // 1. Stylist Navigation
    if (isStylist) {
      return [
        { name: 'Stylist Station', path: '/stylist/station', icon: Scissors },
        { name: 'My Schedule', path: '/front-desk/calendar', icon: Calendar },
        { name: 'Live Floor Queue', path: '/front-desk/queue', icon: Clock },
        { name: 'Client CRM & Formulas', path: '/front-desk/customers', icon: Users },
      ];
    }

    // 2. Front Desk Coordinator (Only Front-Desk Operational Modules)
    if (isFrontDesk || activePortal === 'front-desk') {
      return [
        { name: 'Front Desk Hub', path: '/front-desk/dashboard', icon: LayoutDashboard },
        { name: 'Appointments Calendar', path: '/front-desk/calendar', icon: Calendar },
        { name: 'Live Floor Queue', path: '/front-desk/queue', icon: UserCheck },
        { name: 'POS Register & Billing', path: '/front-desk/pos', icon: CreditCard },
        { name: 'Customer CRM 360°', path: '/front-desk/customers', icon: Users },
        { name: 'Invoices & Receipts', path: '/front-desk/invoices', icon: Receipt },
        { name: 'VIP Memberships', path: '/front-desk/memberships', icon: Gift },
        { name: 'Loyalty & Rewards', path: '/front-desk/loyalty', icon: Award },
      ];
    }

    // 3. Branch Manager Back-Office (Scoped to single branch)
    if (isManager) {
      return [
        { name: 'Branch Manager Hub', path: '/back-office/overview', icon: BarChart3 },
        { name: 'Staff & Attendance', path: '/back-office/team', icon: Users },
        { name: 'Branch Services Menu', path: '/back-office/services', icon: Scissors },
        { name: 'In-Salon Stock & Usage', path: '/back-office/inventory', icon: ShoppingBag },
        { name: 'Petty Cash & Expenses', path: '/back-office/finance', icon: DollarSign },
        { name: 'Daily Branch Reports', path: '/back-office/reports', icon: Layers },
      ];
    }

    // 4. Super Admin Back-Office (Full Multi-Branch Enterprise Suite)
    return [
      { name: 'Executive Overview', path: '/back-office/overview', icon: BarChart3 },
      { name: 'Branches & Hierarchy', path: '/back-office/branches', icon: Building2 },
      { name: 'Services Catalog', path: '/back-office/services', icon: Scissors },
      { name: 'Staff & HR Roster', path: '/back-office/team', icon: Users },
      { name: 'Inventory & Stock', path: '/back-office/inventory', icon: ShoppingBag },
      { name: 'Marketing & Retention', path: '/back-office/marketing', icon: Send },
      { name: 'Expenses & Finance', path: '/back-office/finance', icon: DollarSign },
      { name: 'Analytics & Reports', path: '/back-office/reports', icon: Layers },
      { name: 'System & Security Settings', path: '/back-office/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const getPortalLabel = () => {
    if (isStylist) return '✂️ Stylist Workstation';
    if (isFrontDesk) return '⚡ Front Desk & POS';
    if (activePortal === 'front-desk') return '⚡ Front Desk & POS';
    if (isManager) return '🏢 Branch Operations ERP';
    return '🏛️ Central Back-Office ERP';
  };

  const getSectionTitle = () => {
    if (isStylist) return 'Stylist Tools';
    if (isFrontDesk || activePortal === 'front-desk') return 'Operational Modules';
    if (isManager) return 'Branch Management';
    return 'Enterprise Modules';
  };

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Logo & Portal Tag */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-glow text-lg">
          H
        </div>
        <div>
          <h1 className="font-extrabold tracking-tight text-white flex items-center gap-1.5 text-base">
            HIVE <span className="text-brand-400 font-semibold">SALON</span>
          </h1>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-400/90">
            {getPortalLabel()}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {getSectionTitle()}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Quick Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            MERN API Online
          </span>
          <span className="text-[10px] text-slate-500">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};
