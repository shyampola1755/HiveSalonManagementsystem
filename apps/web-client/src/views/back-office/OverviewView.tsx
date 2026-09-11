import React, { useState, useEffect } from 'react';
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
  const { activeBranchId } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/reports/dashboard');
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

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Executive ERP Overview & Business Intelligence <Sparkles className="w-5 h-5 text-brand-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Centralized multi-branch enterprise performance, revenue yield, and operational health.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL ENTERPRISE REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{metrics.totalRevenue?.toLocaleString('en-IN') || '0'}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs last month
          </div>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>ACTIVE LOCATIONS</span>
            <Building2 className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.activeBranches || 3}</div>
          <div className="text-[11px] text-brand-400 font-medium mt-1">Hyderabad, Mumbai, Bangalore</div>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>QUALIFIED STYLISTS</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.totalStaff || 2}</div>
          <div className="text-[11px] text-sky-400 font-medium mt-1">100% On-shift attendance today</div>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>REGISTERED CLIENTS</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.totalCustomers || 2}</div>
          <div className="text-[11px] text-purple-400 font-medium mt-1">High retention rate (82%)</div>
        </div>
      </div>

      {/* Revenue Yield Chart & Service Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">7-Day Revenue Velocity Trend</h3>
              <p className="text-xs text-slate-400">Aggregated cross-branch gross sales (INR)</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cb923c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#cb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" textAnchor="end" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#cb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Enterprise Highlights</h3>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-emerald-400">🌟 Top Service Category</div>
                <div className="text-slate-200 mt-0.5">French Balayage & Highlights</div>
                <div className="text-[10px] text-slate-400">42% of total service billing</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-brand-400">💎 VIP Retention</div>
                <div className="text-slate-200 mt-0.5">Diamond Pass Sales Up 35%</div>
                <div className="text-[10px] text-slate-400">Highest uptake in Banjara Hills</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-sky-400">🧴 Retail Up-sell Ratio</div>
                <div className="text-slate-200 mt-0.5">2.4 retail units per service</div>
                <div className="text-[10px] text-slate-400">Absolut Repair Mask leading sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
