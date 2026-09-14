import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Award, Coins, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoyaltyView: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await apiClient.get(`/customers?search=${encodeURIComponent(search)}`);
        const getArray = (res: any) => {
          if (!res) return [];
          if (Array.isArray(res.data?.data)) return res.data.data;
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
          return [];
        };
        const list = getArray(res);
        setCustomers(list.filter((c: any) => (c.loyaltyPoints || 0) > 0));
      } catch (e) {
        console.error(e);
      }
    };
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 glass-card p-4 sm:p-5 bg-white border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-600 border border-amber-200 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Loyalty & Rewards Program</h2>
            <p className="text-xs text-slate-500">1 Point earned for every ₹100 spent • Instant redemption at POS</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden bg-white border-slate-200/80 shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 sm:gap-3 bg-slate-50">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Loyalty Point Holders</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search points by client..."
              className="input-field pl-9 text-xs py-1.5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 min-w-[550px]">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 sm:p-4">Customer Name</th>
                <th className="p-3 sm:p-4">Contact</th>
                <th className="p-3 sm:p-4">Total Loyalty Points</th>
                <th className="p-3 sm:p-4">Redemption Value (INR)</th>
                <th className="p-3 sm:p-4">Total Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No loyalty point records found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-slate-900 text-sm">{c.fullName}</td>
                    <td className="p-3 sm:p-4 text-slate-500">{c.phone}</td>
                    <td className="p-3 sm:p-4 font-extrabold text-brand-700 text-sm">
                      {c.loyaltyPoints} pts
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700">
                      ₹{c.loyaltyPoints} (1 pt = ₹1)
                    </td>
                    <td className="p-3 sm:p-4 text-slate-800 font-semibold">{c.totalVisits || 0} visits</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
