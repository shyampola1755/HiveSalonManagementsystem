import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  CreditCard,
  Users,
  UserCheck,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>({
    metrics: {
      todayRevenue: 0,
      totalRevenue: 0,
      todayAppointmentsCount: 0,
      totalCustomers: 0,
    },
    appointmentBreakdown: {
      checkedIn: 0,
      inService: 0,
      scheduled: 0,
      completed: 0,
    },
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const bParam = activeBranchId ? `?branchId=${encodeURIComponent(activeBranchId)}` : '';
      const invParam = activeBranchId ? `?branchId=${encodeURIComponent(activeBranchId)}&limit=5` : '?limit=5';
      const [dashRes, appRes, invRes] = await Promise.all([
        apiClient.get(`/reports/dashboard${bParam}`),
        apiClient.get(`/appointments/queue${bParam}`),
        apiClient.get(`/pos/invoices${invParam}`),
      ]);

      const getArray = (r: any) => {
        if (!r) return [];
        if (Array.isArray(r.data?.data)) return r.data.data;
        if (Array.isArray(r.data)) return r.data;
        if (Array.isArray(r.data?.data?.data)) return r.data.data.data;
        return [];
      };

      const m = dashRes.data?.data || dashRes.data;
      if (m?.metrics) {
        setMetrics(m);
      }

      const apps = getArray(appRes);
      setTodayAppointments(apps);

      const invs = getArray(invRes);
      setRecentInvoices(invs);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Refresh metrics on window focus and poll periodically so POS checkout updates immediately
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(fetchData, 8000);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [activeBranchId]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 sm:p-6 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 border border-amber-200/60 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Front Desk Operations Hub <Sparkles className="w-5 h-5 text-brand-500 shrink-0" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time chair occupancy, today's queue, and active client appointments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/front-desk/pos')}
            className="btn-gold text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 flex-1 sm:flex-none justify-center"
          >
            <CreditCard className="w-4 h-4" /> Open POS Register
          </button>
          <button
            onClick={() => navigate('/front-desk/calendar')}
            className="btn-secondary text-xs font-medium px-3 sm:px-4 py-2 sm:py-2.5 flex-1 sm:flex-none justify-center"
          >
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5 sm:mb-2">
            <span>TODAY'S REVENUE</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{(metrics?.metrics?.todayRevenue ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Collected via cash, cards & UPI
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5 sm:mb-2">
            <span>TODAY'S APPOINTMENTS</span>
            <Calendar className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {metrics?.metrics?.todayAppointmentsCount || todayAppointments.length || 0}
          </div>
          <div className="text-[11px] text-brand-600 font-semibold mt-1">
            {metrics?.appointmentBreakdown?.inService || 0} currently in service
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5 sm:mb-2">
            <span>WAITING IN LOUNGE</span>
            <UserCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {metrics?.appointmentBreakdown?.checkedIn || 0}
          </div>
          <div className="text-[11px] text-sky-600 font-semibold mt-1">
            Ready for chair assignment
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5 sm:mb-2">
            <span>REGISTERED CLIENTS</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {metrics?.metrics?.totalCustomers || 0}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            360° CRM database records
          </div>
        </div>
      </div>

      {/* Main Grid: Live Queue & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Live Salon Queue & Active Appointments */}
        <div className="lg:col-span-2 glass-card p-4 sm:p-6 bg-white border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" /> Live Salon Floor & Appointments
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Active schedule for today</p>
            </div>
            <button
              onClick={() => navigate('/front-desk/queue')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View Full Queue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 sm:py-10 text-slate-400 text-xs">
                No active appointments scheduled for today.
              </div>
            ) : (
              todayAppointments.slice(0, 6).map((app: any) => (
                <div
                  key={app._id}
                  className="p-3 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center font-bold text-amber-800 text-xs shadow-sm shrink-0">
                      {app.startTime}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{app.customerName}</div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                        <span className="text-brand-700 font-medium">{app.serviceName}</span>
                        <span>•</span>
                        <span>Stylist: {app.staffName || 'Any'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <span
                      className={`text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-semibold ${
                        app.status === 'IN_SERVICE'
                          ? 'badge-emerald'
                          : app.status === 'CHECKED_IN'
                          ? 'badge-sky'
                          : 'badge-gold'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => navigate('/front-desk/pos', { state: { appointment: app } })}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-brand-500 hover:text-slate-950 text-slate-700 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-semibold"
                      title="Bill to POS"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span className="sm:hidden">Bill</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent POS Invoices & Operational Shortcuts */}
        <div className="space-y-4 sm:space-y-6">
          {/* Recent POS Invoices Widget */}
          <div className="glass-card p-4 sm:p-6 bg-white border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" /> Recent POS Invoices
              </h3>
              <button
                onClick={() => navigate('/front-desk/invoices')}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-2.5">
              {recentInvoices.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">No invoices generated yet</div>
              ) : (
                recentInvoices.slice(0, 4).map((inv: any) => (
                  <div
                    key={inv._id || inv.id}
                    onClick={() => navigate('/front-desk/invoices')}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 line-clamp-1">{inv.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">#{inv.invoiceNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-brand-700">₹{inv.totalAmount?.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">{inv.payments?.[0]?.method || 'PAID'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
