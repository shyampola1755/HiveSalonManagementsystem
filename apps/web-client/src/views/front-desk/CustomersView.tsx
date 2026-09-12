import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Wallet,
  Sparkles,
  ShieldCheck,
  X,
  CreditCard,
  FileText,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(1000);

  // New Customer Form
  const [newCust, setNewCust] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'FEMALE',
    address: '',
    customerSource: 'WALK_IN',
  });

  const fetchCustomers = async () => {
    try {
      const res = await apiClient.get(`/customers?search=${encodeURIComponent(search)}`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCustomers(res.data.data);
      } else if (Array.isArray(res.data)) {
        setCustomers(res.data);
      } else if (res.data?.data?.success && Array.isArray(res.data.data.data)) {
        setCustomers(res.data.data.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setCustomers(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleSelectCustomer = async (id: string) => {
    try {
      const res = await apiClient.get(`/customers/${id}`);
      if (res.data.success) {
        setSelectedCustomer(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/customers', newCust);
      if (res.data.success) {
        showToast('Customer registered successfully!', 'success');
        setShowAddModal(false);
        setNewCust({
          fullName: '',
          phone: '',
          email: '',
          gender: 'FEMALE',
          address: '',
          customerSource: 'WALK_IN',
        });
        fetchCustomers();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create customer', 'error');
    }
  };

  const handleWalletTopup = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await apiClient.post(`/customers/${selectedCustomer._id}/wallet`, {
        amount: topupAmount,
        type: 'CREDIT',
        reason: 'Front-desk wallet cash/UPI topup',
      });
      if (res.data.success) {
        showToast(`Wallet credited with ₹${topupAmount}`, 'success');
        setShowTopupModal(false);
        handleSelectCustomer(selectedCustomer._id);
        fetchCustomers();
      }
    } catch (e) {
      showToast('Topup failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Add Customer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5 bg-white border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Customer CRM & 360° Profiles</h2>
            <p className="text-xs text-slate-500">Technical color formulas, patch test allergen safety, and client history</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or mobile..."
              className="input-field pl-10 text-xs py-2"
            />
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-gold text-xs font-bold px-4 py-2 shrink-0 shadow-sm">
            <Plus className="w-4 h-4" /> New Customer
          </button>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="glass-card overflow-hidden bg-white border-slate-200/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Wallet Balance</th>
                <th className="p-4">Loyalty Points</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-600">No customers found</p>
                      <p className="text-xs text-slate-400">Click "+ New Customer" above to register a new client.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c._id || c.id}
                    onClick={() => handleSelectCustomer(c._id || c.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{c.fullName}</div>
                      <div className="text-[10px] text-brand-700 font-semibold mt-0.5">{c.tags?.join(' • ') || 'Client'}</div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
                      </div>
                      {c.email && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-emerald-700">₹{c.walletBalance || 0}</td>
                    <td className="p-4 font-bold text-brand-700">{c.loyaltyPoints || 0} pts</td>
                    <td className="p-4 font-bold text-slate-900">₹{c.totalSpent || 0}</td>
                    <td className="p-4 text-right">
                      <button className="text-xs font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1">
                        View 360° <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360° Profile Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedCustomer.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedCustomer.phone} • {selectedCustomer.email || 'No email'}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet & Loyalty Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[11px] text-slate-500">Prepaid Wallet</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">₹{selectedCustomer.walletBalance || 0}</div>
                </div>
                <button onClick={() => setShowTopupModal(true)} className="btn-secondary py-1.5 px-3 text-xs">
                  + Topup
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="text-[11px] text-slate-500">Loyalty Rewards</div>
                <div className="text-xl font-bold text-brand-700 mt-1">{selectedCustomer.loyaltyPoints || 0} pts</div>
              </div>
            </div>

            {/* Hair & Skin Technical Profile */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs shadow-sm">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" /> Technical Beauty Profile
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-700">
                <div>Hair Texture: <span className="text-slate-900 font-semibold">{selectedCustomer.hairProfile?.texture || 'Normal'}</span></div>
                <div>Porosity: <span className="text-slate-900 font-semibold">{selectedCustomer.hairProfile?.porosity || 'Medium'}</span></div>
                <div>Skin Type: <span className="text-slate-900 font-semibold">{selectedCustomer.skinProfile?.skinType || 'Combination'}</span></div>
                <div>Allergies: <span className="text-rose-600 font-semibold">{selectedCustomer.skinProfile?.allergies?.join(', ') || 'None reported'}</span></div>
              </div>
            </div>

            {/* Hair Color Formulas */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Technical Hair Color Formulas</h4>
              <div className="space-y-2">
                {selectedCustomer.colorFormulas?.length === 0 ? (
                  <div className="text-xs text-slate-400 py-3">No color formula records yet.</div>
                ) : (
                  selectedCustomer.colorFormulas?.map((f: any) => (
                    <div key={f._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-sm">
                      <div className="font-bold text-brand-800">{f.formulaName}</div>
                      <div className="text-slate-700 mt-1 font-mono text-[11px]">{f.formulaMix} ({f.brand})</div>
                      <div className="text-[10px] text-slate-500 mt-1">Developer: {f.developerVolume} • Timing: {f.processingTimeMinutes}m</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Patch Tests */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Safety Patch Tests</h4>
              <div className="space-y-2">
                {selectedCustomer.patchTests?.length === 0 ? (
                  <div className="text-xs text-slate-400 py-3">No patch tests recorded.</div>
                ) : (
                  selectedCustomer.patchTests?.map((pt: any) => (
                    <div key={pt._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs shadow-sm">
                      <div>
                        <div className="font-bold text-slate-800">{pt.testType}</div>
                        <div className="text-[11px] text-slate-500">{pt.chemicalOrBrandName}</div>
                      </div>
                      <span className={`text-[10px] font-bold ${pt.result === 'PASSED' ? 'badge-emerald' : 'badge-rose'}`}>
                        {pt.result}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full glass-card p-6 bg-white border-slate-200 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Top-up Prepaid Wallet</h3>
            <input
              type="number"
              value={topupAmount}
              onChange={(e) => setTopupAmount(Number(e.target.value))}
              placeholder="Amount in INR"
              className="input-field mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowTopupModal(false)} className="btn-secondary flex-1 text-xs py-2">
                Cancel
              </button>
              <button onClick={handleWalletTopup} className="btn-gold flex-1 text-xs py-2 font-bold shadow-sm">
                Credit Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 bg-white border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" /> New Customer Registration
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newCust.fullName}
                  onChange={(e) => setNewCust({ ...newCust, fullName: e.target.value })}
                  placeholder="e.g. Deepika Padukone"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={newCust.phone}
                  onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  placeholder="name@example.com"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs mt-2 shadow-sm">
                Save & Register Client
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
