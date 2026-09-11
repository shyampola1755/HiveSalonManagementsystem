import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Scissors, Plus, Search, Edit2, X, CheckCircle2 } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    durationMinutes: 45,
    basePrice: 1500,
    customerDescription: '',
  });

  const fetchData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        apiClient.get('/services'),
        apiClient.get('/services/categories'),
      ]);
      if (sRes.data.success) setServices(sRes.data.data);
      if (cRes.data.success) setCategories(cRes.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/services', formData);
      if (res.data.success) {
        showToast('Service added to master catalog!', 'success');
        setShowModal(false);
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create service', 'error');
    }
  };

  const filtered = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Master Services Catalog & Pricing</h2>
            <p className="text-xs text-slate-400">Service hierarchy, durations, GST rates, and chemical recipes</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="input-field pl-9 text-xs py-1.5"
            />
          </div>
          <button onClick={() => setShowModal(true)} className="btn-gold text-xs font-bold px-4 py-2 shrink-0">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Base Price (INR)</th>
                <th className="p-4">GST Rate</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{s.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{s.customerDescription}</div>
                  </td>
                  <td className="p-4">
                    <span className="badge-sky text-[10px]">{s.categoryId?.name || 'Hair'}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{s.durationMinutes} mins</td>
                  <td className="p-4 font-bold text-white text-sm">₹{s.basePrice}</td>
                  <td className="p-4 text-slate-400">18% GST</td>
                  <td className="p-4">
                    <span className="badge-emerald text-[10px]">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Create New Service</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Brazilian Keratin Infusion"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="input-field"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Marketing Description</label>
                <textarea
                  value={formData.customerDescription}
                  onChange={(e) => setFormData({ ...formData, customerDescription: e.target.value })}
                  placeholder="Describe treatment steps, benefits, and client expectations..."
                  rows={3}
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs mt-2">
                Save & Add to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
