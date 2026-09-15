import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Auth View
import { LoginView } from './views/auth/LoginView';

// Portal 1: Front Desk & POS Views
import { DashboardView } from './views/front-desk/DashboardView';
import { CalendarView } from './views/front-desk/CalendarView';
import { QueueView } from './views/front-desk/QueueView';
import { PosView } from './views/front-desk/PosView';
import { CustomersView } from './views/front-desk/CustomersView';
import { InvoicesView } from './views/front-desk/InvoicesView';
import { MembershipsView } from './views/front-desk/MembershipsView';
import { LoyaltyView } from './views/front-desk/LoyaltyView';

// Stylist Station View
import { StylistView } from './views/stylist/StylistView';

// Portal 2: Back Office ERP Views
import { OverviewView } from './views/back-office/OverviewView';
import { BranchesView } from './views/back-office/BranchesView';
import { ServicesView } from './views/back-office/ServicesView';
import { TeamView } from './views/back-office/TeamView';
import { InventoryView } from './views/back-office/InventoryView';
import { MarketingView } from './views/back-office/MarketingView';
import { FinanceView } from './views/back-office/FinanceView';
import { ReportsView } from './views/back-office/ReportsView';

export const App: React.FC = () => {
  const { token, isLoading, canAccessBackOffice, isStylist, isSuperAdmin, isManager } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070a12] flex items-center justify-center text-brand-400 font-bold text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
          <span>Loading Hive Salon ERP...</span>
        </div>
      </div>
    );
  }

  const getDefaultRoute = () => {
    if (!token) return '/login';
    if (isStylist) return '/stylist/station';
    if (canAccessBackOffice) return '/back-office/overview';
    return '/front-desk/dashboard';
  };

  return (
    <Routes>
      <Route path="/login" element={!token ? <LoginView /> : <Navigate to={getDefaultRoute()} />} />
      <Route path="/pos-login" element={!token ? <LoginView /> : <Navigate to="/front-desk/pos" />} />
      <Route path="/pos" element={token ? <Navigate to="/front-desk/pos" /> : <Navigate to="/pos-login" />} />

      {/* Protected Routes inside AppShell */}
      <Route element={token ? <AppShell /> : <Navigate to="/login" />}>
        {/* Stylist Specific */}
        <Route path="/stylist/station" element={<StylistView />} />

        {/* Portal 1: Front Desk & POS */}
        <Route path="/front-desk/dashboard" element={<DashboardView />} />
        <Route path="/front-desk/calendar" element={<CalendarView />} />
        <Route path="/front-desk/queue" element={<QueueView />} />
        <Route path="/front-desk/pos" element={<PosView />} />
        <Route path="/front-desk/customers" element={<CustomersView />} />
        <Route path="/front-desk/invoices" element={<InvoicesView />} />
        <Route path="/front-desk/memberships" element={<MembershipsView />} />
        <Route path="/front-desk/loyalty" element={<LoyaltyView />} />

        {/* Portal 2: Back Office ERP (Protected by canAccessBackOffice) */}
        <Route
          path="/back-office/overview"
          element={canAccessBackOffice ? <OverviewView /> : <Navigate to="/front-desk/dashboard" />}
        />
        <Route
          path="/back-office/branches"
          element={isSuperAdmin ? <BranchesView /> : <Navigate to="/back-office/overview" />}
        />
        <Route
          path="/back-office/services"
          element={canAccessBackOffice ? <ServicesView /> : <Navigate to="/front-desk/dashboard" />}
        />
        <Route
          path="/back-office/team"
          element={canAccessBackOffice ? <TeamView /> : <Navigate to="/front-desk/dashboard" />}
        />
        <Route
          path="/back-office/inventory"
          element={canAccessBackOffice ? <InventoryView /> : <Navigate to="/front-desk/dashboard" />}
        />
        <Route
          path="/back-office/marketing"
          element={canAccessBackOffice ? <MarketingView /> : <Navigate to="/front-desk/dashboard" />}
        />
        <Route
          path="/back-office/finance"
          element={canAccessBackOffice ? <FinanceView /> : <Navigate to="/front-desk/dashboard" />}
        />
        <Route
          path="/back-office/reports"
          element={canAccessBackOffice ? <ReportsView /> : <Navigate to="/front-desk/dashboard" />}
        />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};
