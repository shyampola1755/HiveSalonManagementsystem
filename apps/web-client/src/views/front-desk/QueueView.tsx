import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserCheck, Clock, CheckCircle2, Play, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QueueView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<any[]>([]);

  const fetchQueue = async () => {
    try {
      const res = await apiClient.get('/appointments/queue');
      if (res.data.success) {
        setQueue(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000); // Polling queue every 15s
    return () => clearInterval(interval);
  }, [activeBranchId]);

  const updateStatus = async (appId: string, status: string) => {
    try {
      const res = await apiClient.put(`/appointments/${appId}/status`, { status });
      if (res.data.success) {
        showToast(`Status updated to ${status.replace('_', ' ')}`, 'success');
        fetchQueue();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const loungeGuests = queue.filter((a) => a.status === 'CHECKED_IN' || a.status === 'SCHEDULED' || a.status === 'CONFIRMED');
  const inServiceGuests = queue.filter((a) => a.status === 'IN_SERVICE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Live Salon Floor & Waiting Lounge</h2>
            <p className="text-xs text-slate-400">Manage client check-ins, chair assignments, and in-service progress</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Waiting Lounge vs In-Service Chairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waiting Lounge Column */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
              Waiting Lounge ({loungeGuests.length})
            </h3>
          </div>

          <div className="space-y-3">
            {loungeGuests.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">No guests waiting in lounge</div>
            ) : (
              loungeGuests.map((guest) => (
                <div key={guest._id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-white">{guest.customerName}</div>
                      <div className="text-xs text-brand-300 font-medium">{guest.serviceName}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Scheduled: {guest.startTime} • Stylist: {guest.staffName || 'Any Available'}
                      </div>
                    </div>
                    <span className="badge-sky text-[10px]">{guest.status.replace('_', ' ')}</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => updateStatus(guest._id, 'IN_SERVICE')}
                      className="btn-gold flex-1 py-1.5 text-xs font-bold"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Service (Seat Chair)
                    </button>
                    <button
                      onClick={() => updateStatus(guest._id, 'NO_SHOW')}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      No Show
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* In-Service Chairs Column */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              In-Service Salon Chairs ({inServiceGuests.length})
            </h3>
          </div>

          <div className="space-y-3">
            {inServiceGuests.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">No clients currently in chairs</div>
            ) : (
              inServiceGuests.map((guest) => (
                <div key={guest._id} className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-white">{guest.customerName}</div>
                      <div className="text-xs text-emerald-400 font-medium">{guest.serviceName}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Stylist: <span className="text-slate-200 font-semibold">{guest.staffName}</span>
                      </div>
                    </div>
                    <span className="badge-emerald text-[10px]">In Progress</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => navigate('/front-desk/pos', { state: { appointment: guest } })}
                      className="btn-gold flex-1 py-1.5 text-xs font-bold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete & Bill at POS
                    </button>
                    <button
                      onClick={() => updateStatus(guest._id || guest.id, 'COMPLETED')}
                      className="btn-secondary py-1.5 px-3 text-xs font-semibold hover:bg-emerald-600/30 hover:text-emerald-300"
                      title="Mark service as completed"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
