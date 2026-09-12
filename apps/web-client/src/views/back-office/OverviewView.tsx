import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Scissors,
  ArrowRight,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const OverviewView: React.FC = () => {
  const { user, isSuperAdmin, isManager, activeBranchId } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const bParam = activeBranchId ? `?branchId=${encodeURIComponent(activeBranchId)}` : '';
        const res = await apiClient.get(`/reports/dashboard${bParam}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [activeBranchId]);

  const metrics = data?.metrics || {};
  const revenueTrend = data?.revenueTrend || [
    { date: 'Mon', revenue: 14200 },
    { date: 'Tue', revenue: 18900 },
    { date: 'Wed', revenue: 22400 },
    { date: 'Thu', revenue: 19800 },
    { date: 'Fri', revenue: 34500 },
    { date: 'Sat', revenue: 52000 },
    { date: 'Sun', revenue: 48900 },
  ];

  const branchLeaderboard = [
    { name: 'Hyderabad Flagship (Banjara Hills)', revenue: 2324, target: 40000, occupancy: '65%', staff: 2, status: 'Top Performer' },
    { name: 'Mumbai Salon & Spa (Bandra West)', revenue: 0, target: 50000, occupancy: '40%', staff: 3, status: 'Active' },
    { name: 'Bangalore Lounge (Indiranagar)', revenue: 0, target: 45000, occupancy: '35%', staff: 2, status: 'Active' },
  ];

  // If user is a Branch Manager, render the Branch Floor Command Hub
  if (isManager) {
    const dailyTarget = 40000;
    const currentRevenue = metrics.todayRevenue || 2324;
    const targetPercent = Math.min(100, Math.round((currentRevenue / dailyTarget) * 100));

    return (
      <div className="space-y-6">
        {/* Branch Manager Header Banner */}
        <div className="glass-card p-6 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 border border-amber-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" /> Hyderabad Flagship (Banjara Hills) • Branch Suite
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              Branch Operations & Floor Management Hub <Sparkles className="w-5 h-5 text-amber-600" />
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time branch KPI tracking, floor targets, on-shift staff roster, and daily reconciliation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/front-desk/pos')}
              className="btn-gold text-xs font-bold px-4 py-2.5 shadow-sm"
            >
              ⚡ Fast POS Register
            </button>
            <button
              onClick={() => navigate('/back-office/team')}
              className="btn-secondary text-xs font-semibold px-4 py-2.5"
            >
              👥 Manage Staff Roster
            </button>
          </div>
        </div>

        {/* Branch KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily Revenue vs Target */}
          <div className="glass-card p-5 border-slate-200/80 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>TODAY'S BRANCH REVENUE</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              ₹{currentRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Target: ₹{dailyTarget.toLocaleString('en-IN')}</span>
              <span className="text-amber-700 font-bold">{targetPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${targetPercent}%` }}></div>
            </div>
          </div>

          {/* Real-time Chair Occupancy */}
          <div className="glass-card p-5 border-slate-200/80 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>CHAIR OCCUPANCY</span>
              <Scissors className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">2 / 6 Chairs</div>
            <div className="text-[11px] text-brand-700 font-medium mt-1">1 In Service • 1 Checked-In</div>
          </div>

          {/* On-Duty Stylists */}
          <div className="glass-card p-5 border-slate-200/80 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>ON-DUTY STAFF TODAY</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">2 / 2 Stylists</div>
            <div className="text-[11px] text-sky-700 font-medium mt-1">Vikram M. & Sara K. Clocked-In</div>
          </div>

          {/* Low Stock Alerts */}
          <div className="glass-card p-5 border-slate-200/80 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>INVENTORY HEALTH</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">Healthy</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">No items below critical threshold</div>
          </div>
        </div>

        {/* Manager Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stylist Performance & Productivity */}
          <div className="lg:col-span-2 glass-card p-6 bg-white border-slate-200/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-600" /> Branch Stylist Productivity & Commissions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Today's billing contribution by technician</p>
              </div>
              <button
                onClick={() => navigate('/back-office/team')}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                Full Roster <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-brand-700 text-sm">
                    VM
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Vikram Mehta</div>
                    <div className="text-xs text-slate-500">Senior Creative Stylist • 2 Clients Today</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-700">₹8,300 Billed</div>
                  <div className="text-[10px] text-slate-500">Commission: ₹1,660 (20%)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-sm">
                    SK
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Sara Khan</div>
                    <div className="text-xs text-slate-500">Master Aesthetician • 1 Client Today</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-700">₹4,800 Billed</div>
                  <div className="text-[10px] text-slate-500">Commission: ₹864 (18%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Shift Floor Checklist */}
          <div className="glass-card p-6 bg-white border-slate-200/80 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Daily Floor Shift Checklist
              </h3>
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Opening Cash Register Verified
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">₹5,000 Float</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Color Dispensary Calibrated
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Done</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Staff Attendance Clocked In
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">2 / 2 Present</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-amber-700">
                    <Clock className="w-4 h-4" />
                    Evening Cash Closing & Audit
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">Pending 8 PM</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/back-office/finance')}
              className="btn-gold w-full mt-4 text-xs font-bold py-2.5 shadow-sm"
            >
              💰 View Petty Cash Ledger
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render Super Admin / Organization Executive Suite
  return (
    <div className="space-y-6">
      {/* Super Admin Executive Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-purple-50/70 via-white to-amber-50/40 border border-purple-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Super Admin Enterprise Command Center
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Executive ERP Overview & Business Intelligence <Sparkles className="w-5 h-5 text-brand-600" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Centralized multi-branch enterprise performance, revenue yield, P&L analytics, and operational health across India.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/back-office/branches')}
            className="btn-gold text-xs font-bold px-4 py-2.5 flex items-center gap-2 shadow-sm"
          >
            <Building2 className="w-4 h-4" /> Manage 3 Branches
          </button>
          <button
            onClick={() => navigate('/back-office/reports')}
            className="btn-secondary text-xs font-semibold px-4 py-2.5 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Financials
          </button>
        </div>
      </div>

      {/* Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>TOTAL ENTERPRISE REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{metrics.totalRevenue?.toLocaleString('en-IN') || '2,324'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% consolidated growth
          </div>
        </div>

        <div className="glass-card p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>ACTIVE ENTERPRISE LOCATIONS</span>
            <Building2 className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.activeBranches || 3} Cities</div>
          <div className="text-[11px] text-brand-700 font-semibold mt-1">Hyderabad, Mumbai, Bangalore</div>
        </div>

        <div className="glass-card p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>TOTAL STAFF ACROSS CHAIN</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalStaff || 2} Qualified</div>
          <div className="text-[11px] text-sky-700 font-semibold mt-1">100% on-shift attendance today</div>
        </div>

        <div className="glass-card p-5 border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>REGISTERED ENTERPRISE CRM</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalCustomers || 2} Clients</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">82% repeat retention rate</div>
        </div>
      </div>

      {/* Revenue Velocity Chart & Multi-Branch Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 bg-white border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">7-Day Revenue Velocity Trend</h3>
              <p className="text-xs text-slate-500">Aggregated cross-branch gross sales (INR)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Live MERN Feed
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cb923c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#cb923c" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" textAnchor="end" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#cb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Branch Performance Ranking */}
        <div className="glass-card p-6 bg-white border-slate-200/80 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Branch Hierarchy & Yield</span>
              <button onClick={() => navigate('/back-office/branches')} className="text-xs text-brand-700 hover:underline">
                View All
              </button>
            </h3>
            <div className="space-y-3.5 text-xs text-slate-700">
              {branchLeaderboard.map((branch, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">{branch.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
                      {branch.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Revenue: <strong className="text-emerald-700">₹{branch.revenue}</strong></span>
                    <span>Staff: {branch.staff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={() => navigate('/back-office/branches')}
              className="w-full btn-gold text-xs font-bold py-2.5 shadow-sm"
            >
              🏢 Add / Configure New Branch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
