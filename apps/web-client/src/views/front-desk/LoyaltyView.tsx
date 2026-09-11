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
        if (res.data.success) {
          setCustomers(res.data.data.filter((c: any) => c.loyaltyPoints > 0));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Loyalty & Rewards Program</h2>
            <p className="text-xs text-slate-400">1 Point earned for every ₹100 spent • Instant redemption at POS</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Loyalty Point Holders</h3>
          <div className="relative w-64">
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
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Total Loyalty Points</th>
                <th className="p-4">Redemption Value (INR)</th>
                <th className="p-4">Total Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{c.fullName}</td>
                  <td className="p-4 text-slate-400">{c.phone}</td>
                  <td className="p-4 font-extrabold text-brand-400 text-sm">
                    {c.loyaltyPoints} pts
                  </td>
                  <td className="p-4 font-bold text-emerald-400">
                    ₹{c.loyaltyPoints} (1 pt = ₹1)
                  </td>
                  <td className="p-4 text-slate-200 font-semibold">{c.totalVisits || 0} visits</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
