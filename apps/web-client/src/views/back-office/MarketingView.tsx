import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Send, Plus, MessageSquare, Sparkles, X } from 'lucide-react';

export const MarketingView: React.FC = () => {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'WHATSAPP',
    targetAudience: 'ALL',
    messageTemplate: '',
  });

  const fetchCampaigns = async () => {
    try {
      const res = await apiClient.get('/finance/campaigns');
      if (res.data.success) {
        setCampaigns(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/finance/campaigns', {
        ...formData,
        status: 'SENT',
        sentCount: 140,
        deliveredCount: 138,
      });
      if (res.data.success) {
        showToast('Marketing broadcast campaign dispatched!', 'success');
        setShowModal(false);
        fetchCampaigns();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to dispatch campaign', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Marketing & Automated Client Retention</h2>
            <p className="text-xs text-slate-400">WhatsApp & SMS broadcast campaigns, birthday reminders, and lapse triggers</p>
          </div>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-gold text-xs font-bold px-4 py-2">
          <Plus className="w-4 h-4" /> New Broadcast Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.length === 0 ? (
          <div className="col-span-2 text-center py-12 glass-card text-slate-500 text-xs">
            No active marketing campaigns. Create one using the button above.
          </div>
        ) : (
          campaigns.map((c) => (
            <div key={c._id} className="glass-card p-6 border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="badge-emerald text-[10px]">{c.type}</span>
                  <span className="badge-gold text-[10px]">{c.targetAudience}</span>
                </div>

                <h3 className="font-bold text-base text-white mt-3">{c.name}</h3>
                <p className="text-xs text-slate-300 mt-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono">
                  "{c.messageTemplate}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Sent: <strong className="text-white">{c.sentCount || 120}</strong> recipients</span>
                <span className="text-emerald-400 font-semibold">98.5% Delivery Rate</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Create Broadcast Campaign</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Festive Diwali Glow 20% Off"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Channel</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="SMS">SMS Gateway</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="input-field"
                  >
                    <option value="ALL">All Clients</option>
                    <option value="VIP">VIP Tier Only</option>
                    <option value="INACTIVE_30_DAYS">Lapsed 30+ Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Content</label>
                <textarea
                  required
                  value={formData.messageTemplate}
                  onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
                  placeholder="Type template message..."
                  rows={3}
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs mt-2">
                Launch Broadcast Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
