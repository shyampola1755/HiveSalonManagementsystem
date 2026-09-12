import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building2, Plus, MapPin, Phone, Mail, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const BranchesView: React.FC = () => {
  const { showToast } = useToast();
  const [branches, setBranches] = useState<any[]>([]);
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
  });

  const fetchData = async () => {
    try {
      const [bRes, hRes] = await Promise.all([
        apiClient.get('/branches'),
        apiClient.get('/branches/hierarchy'),
      ]);
      if (bRes.data.success) setBranches(bRes.data.data);
      if (hRes.data.success) setHierarchy(hRes.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { refreshBranches } = useAuth();
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/branches', formData);
      if (res.data.success) {
        showToast('Branch location added successfully!', 'success');
        setShowModal(false);
        setFormData({ name: '', code: '', address: '', phone: '', email: '' });
        await fetchData();
        await refreshBranches();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add branch', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-card p-5 bg-white border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-600 border border-amber-200 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Salon Branches & Multi-Branch Network</h2>
            <p className="text-xs text-slate-500">State → District → City → Branch organizational hierarchy</p>
          </div>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-gold text-xs font-bold px-4 py-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add New Branch
        </button>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div key={b._id} className="glass-card p-6 bg-white border-slate-200/80 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-start">
                <span className="badge-gold text-[10px] font-mono">{b.code}</span>
                {b.isMainBranch && <span className="badge-emerald text-[10px]">Flagship HQ</span>}
              </div>

              <h3 className="font-extrabold text-base text-slate-900 mt-3">{b.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                {b.address}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {b.phone}
                </div>
                {b.email && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {b.email}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online & Active
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{b.taxConfig?.gstNumber || 'GST Enabled'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 bg-white border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Create New Branch</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pune Luxury Lounge (Koregaon Park)"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Branch Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="PUN-01"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Area, City"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs mt-2 shadow-sm">
                Save & Initialize Branch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
