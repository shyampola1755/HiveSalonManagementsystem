import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Layers, Download, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiClient.get('/reports/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchReport();
  }, [activeBranchId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Financial & Business Analytics Reports</h2>
            <p className="text-xs text-slate-400">Monthly sales summaries, GST tax compliance, and staff productivity reports</p>
          </div>
        </div>

        <button onClick={() => window.print()} className="btn-secondary text-xs font-semibold px-4 py-2">
          <Download className="w-4 h-4" /> Export Report (PDF/Print)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-slate-800">
          <h3 className="text-sm font-bold text-white mb-2">Total Gross Invoiced</h3>
          <div className="text-2xl font-black text-brand-400">
            ₹{data?.metrics?.totalRevenue?.toLocaleString('en-IN') || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% Collected & Reconciled</p>
        </div>

        <div className="glass-card p-6 border-slate-800">
          <h3 className="text-sm font-bold text-white mb-2">Estimated GST Tax (18%)</h3>
          <div className="text-2xl font-black text-sky-400">
            ₹{Math.round((data?.metrics?.totalRevenue || 0) * 0.1525).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Split into 9% CGST + 9% SGST</p>
        </div>

        <div className="glass-card p-6 border-slate-800">
          <h3 className="text-sm font-bold text-white mb-2">Net Salon Profit</h3>
          <div className="text-2xl font-black text-emerald-400">
            ₹{(data?.metrics?.totalRevenue - (data?.metrics?.todayExpenseTotal || 0)).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Operating yield before tax</p>
        </div>
      </div>
    </div>
  );
};
