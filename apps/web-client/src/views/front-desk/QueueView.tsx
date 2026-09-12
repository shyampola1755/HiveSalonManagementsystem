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
      const getArray = (r: any) => {
        if (!r) return [];
        if (Array.isArray(r.data?.data)) return r.data.data;
        if (Array.isArray(r.data)) return r.data;
        if (Array.isArray(r.data?.data?.data)) return r.data.data.data;
        return [];
      };
      const data = getArray(res);
      setQueue(data);
    } catch (e) {
      console.error('Error fetching queue:', e);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000); // Polling queue every 10s
    return () => clearInterval(interval);
  }, [activeBranchId]);

  const updateStatus = async (appId: string, status: string) => {
    try {
      // Optimistically update queue immediately
      setQueue((prevQueue) =>
        status === 'COMPLETED' || status === 'CANCELLED'
          ? prevQueue.filter((a) => (a._id !== appId && a.id !== appId))
          : prevQueue.map((a) => (a._id === appId || a.id === appId ? { ...a, status } : a))
      );

      const res = await apiClient.put(`/appointments/${appId}/status`, { status });
      if (res.data?.success) {
        showToast(`Status updated to ${status.replace('_', ' ')}`, 'success');
      }
      fetchQueue();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
      fetchQueue();
    }
  };

  const loungeGuests = queue.filter((a) => a.status === 'CHECKED_IN' || a.status === 'SCHEDULED' || a.status === 'CONFIRMED');
  const inServiceGuests = queue.filter((a) => a.status === 'IN_SERVICE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-card p-5 bg-white border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Live Salon Floor & Waiting Lounge</h2>
            <p className="text-xs text-slate-500">Manage client check-ins, chair assignments, and in-service progress</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Waiting Lounge vs In-Service Chairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waiting Lounge Column */}
        <div className="glass-card p-5 bg-white border-slate-200/80">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              Waiting Lounge ({loungeGuests.length})
            </h3>
          </div>

          <div className="space-y-3">
            {loungeGuests.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">No guests waiting in lounge</div>
            ) : (
              loungeGuests.map((guest) => (
                <div key={guest._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{guest.customerName}</div>
                      <div className="text-xs text-brand-700 font-semibold">{guest.serviceName}</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Scheduled: {guest.startTime} • Stylist: {guest.staffName || 'Any Available'}
                      </div>
                    </div>
                    <span className="badge-sky text-[10px]">{guest.status.replace('_', ' ')}</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-200">
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
        <div className="glass-card p-5 bg-white border-slate-200/80">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              In-Service Salon Chairs ({inServiceGuests.length})
            </h3>
          </div>

          <div className="space-y-3">
            {inServiceGuests.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">No clients currently in chairs</div>
            ) : (
              inServiceGuests.map((guest) => (
                <div key={guest._id} className="p-4 rounded-xl bg-slate-50 border border-emerald-200 flex flex-col justify-between gap-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{guest.customerName}</div>
                      <div className="text-xs text-emerald-700 font-semibold">{guest.serviceName}</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Stylist: <span className="text-slate-800 font-semibold">{guest.staffName}</span>
                      </div>
                    </div>
                    <span className="badge-emerald text-[10px]">In Progress</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => navigate('/front-desk/pos', { state: { appointment: guest } })}
                      className="btn-gold flex-1 py-1.5 text-xs font-bold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete & Bill at POS
                    </button>
                    <button
                      onClick={() => updateStatus(guest._id || guest.id, 'COMPLETED')}
                      className="btn-secondary py-1.5 px-3 text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700"
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
