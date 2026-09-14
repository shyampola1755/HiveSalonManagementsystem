import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Gift, CheckCircle2, Sparkles, Plus, X } from 'lucide-react';

export const MembershipsView: React.FC = () => {
  const { showToast } = useToast();
  const [tiers, setTiers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

  const fetchData = async () => {
    try {
      const [tiersRes, pkgRes, custRes] = await Promise.all([
        apiClient.get('/memberships/tiers'),
        apiClient.get('/memberships/packages'),
        apiClient.get('/customers?limit=100'),
      ]);

      const getArray = (res: any) => {
        if (!res) return [];
        if (Array.isArray(res.data?.data)) return res.data.data;
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
        return [];
      };

      setTiers(getArray(tiersRes));
      setPackages(getArray(pkgRes));
      setCustomers(getArray(custRes));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier || !selectedCustomer) return;
    try {
      const res = await apiClient.post('/memberships/subscribe', {
        customerId: selectedCustomer,
        tierId: selectedTier._id,
      });
      if (res.data.success) {
        showToast('Membership plan activated for client!', 'success');
        setShowSellModal(false);
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Subscription failed', 'error');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 glass-card p-4 sm:p-5 bg-white border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-600 border border-amber-200 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">VIP Memberships & Service Packages</h2>
            <p className="text-xs text-slate-500">Exclusive privilege tiers, recurring perks, and multi-session service passes</p>
          </div>
        </div>
      </div>

      {/* Membership Tiers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {tiers.map((tier) => (
          <div key={tier._id} className="glass-card p-4 sm:p-6 bg-white border-slate-200/80 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{tier.name}</h3>
                  <div className="text-xs text-brand-700 font-bold mt-0.5">{tier.validityDays} Days Validity</div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">₹{tier.price?.toLocaleString('en-IN')}</div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {tier.discountPercentage}% Discount on all services
                </div>
                {tier.perks?.map((perk: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" /> {perk}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedTier(tier);
                setShowSellModal(true);
              }}
              className="btn-gold w-full mt-5 sm:mt-6 py-2.5 text-xs font-bold shadow-sm"
            >
              Sell Membership to Client
            </button>
          </div>
        ))}
      </div>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-md w-full glass-card p-5 sm:p-6 bg-white border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Enroll in {selectedTier?.name}</h3>
              <button onClick={() => setShowSellModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Client</label>
                <select
                  required
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="input-field"
                >
                  <option value="">-- Choose Client --</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between font-bold">
                <span className="text-slate-500">Plan Fee:</span>
                <span className="text-brand-700 text-sm">₹{selectedTier?.price}</span>
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs shadow-sm">
                Confirm Enrollment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
