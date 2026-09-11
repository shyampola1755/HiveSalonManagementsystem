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
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashRes, appRes] = await Promise.all([
          apiClient.get('/reports/dashboard'),
          apiClient.get('/appointments/queue'),
        ]);
        if (dashRes.data.success) {
          setMetrics(dashRes.data.data);
        }
        if (appRes.data.success) {
          setTodayAppointments(appRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeBranchId]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Front Desk Operations Hub <Sparkles className="w-5 h-5 text-brand-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time chair occupancy, today's queue, and active client appointments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/front-desk/pos')} className="btn-gold text-xs font-bold px-4 py-2.5">
            <CreditCard className="w-4 h-4" /> Open POS Register
          </button>
          <button onClick={() => navigate('/front-desk/calendar')} className="btn-secondary text-xs font-medium px-4 py-2.5">
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TODAY'S REVENUE</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{metrics?.metrics?.todayRevenue?.toLocaleString('en-IN') || '0'}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Collected via cash, cards & UPI
          </div>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TODAY'S APPOINTMENTS</span>
            <Calendar className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {metrics?.metrics?.todayAppointmentsCount || todayAppointments.length || 0}
          </div>
          <div className="text-[11px] text-brand-400 font-medium mt-1">
            {metrics?.appointmentBreakdown?.inService || 0} currently in service
          </div>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>WAITING IN LOUNGE</span>
            <UserCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {metrics?.appointmentBreakdown?.checkedIn || 0}
          </div>
          <div className="text-[11px] text-sky-400 font-medium mt-1">
            Ready for chair assignment
          </div>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>REGISTERED CLIENTS</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {metrics?.metrics?.totalCustomers || 0}
          </div>
          <div className="text-[11px] text-purple-400 font-medium mt-1">
            360° CRM database records
          </div>
        </div>
      </div>

      {/* Main Grid: Live Queue & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Salon Queue & Active Appointments */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" /> Live Salon Floor & Appointments
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Active schedule for today</p>
            </div>
            <button
              onClick={() => navigate('/front-desk/queue')}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View Full Queue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No active appointments scheduled for today.
              </div>
            ) : (
              todayAppointments.slice(0, 6).map((app: any) => (
                <div
                  key={app._id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-brand-400 text-xs">
                      {app.startTime}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-100">{app.customerName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-brand-300 font-medium">{app.serviceName}</span>
                        <span>•</span>
                        <span>Stylist: {app.staffName || 'Any'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
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
                      onClick={() => navigate('/front-desk/pos')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-300 transition-colors"
                      title="Bill to POS"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Launch & Stylist Availability */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" /> Operational Shortcuts
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/front-desk/customers')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs font-medium text-slate-200 transition-colors"
              >
                <span>🔍 Search 360° Client Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/front-desk/memberships')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs font-medium text-slate-200 transition-colors"
              >
                <span>🎁 Sell VIP Membership / Pass</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/front-desk/loyalty')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs font-medium text-slate-200 transition-colors"
              >
                <span>👑 Loyalty Points Lookup & Rewards</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
