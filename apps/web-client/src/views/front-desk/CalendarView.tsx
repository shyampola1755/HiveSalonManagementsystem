import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Scissors,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    serviceId: '',
    staffId: '',
    startTime: '11:00',
    durationMinutes: 60,
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [appRes, staffRes, svcRes, custRes] = await Promise.all([
        apiClient.get(`/appointments?date=${selectedDate}`),
        apiClient.get('/staff'),
        apiClient.get('/services'),
        apiClient.get('/customers?limit=100'),
      ]);

      const getArray = (res: any) => {
        if (!res) return [];
        if (Array.isArray(res.data?.data)) return res.data.data;
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
        return [];
      };

      setAppointments(getArray(appRes));
      setStaffList(getArray(staffRes));
      setServicesList(getArray(svcRes));
      setCustomersList(getArray(custRes));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, activeBranchId]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/appointments', {
        ...formData,
        appointmentDate: selectedDate,
      });
      if (res.data.success) {
        showToast('Appointment booked successfully!', 'success');
        setShowBookingModal(false);
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to book appointment', 'error');
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Appointments & Stylist Calendar</h2>
            <p className="text-xs text-slate-400">Resource board for {selectedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field py-1.5 px-3 text-xs w-auto cursor-pointer"
          />
          <button
            onClick={() => setShowBookingModal(true)}
            className="btn-gold text-xs font-bold px-4 py-2"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Calendar Grid by Stylists */}
      <div className="glass-card p-5 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row: Stylists */}
          <div className="grid grid-cols-5 gap-3 pb-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">Time Slot</div>
            {staffList.slice(0, 4).map((staff) => (
              <div key={staff._id} className="text-center font-bold text-slate-200">
                {staff.displayName}
                <div className="text-[10px] text-brand-400 font-normal">{staff.jobTitle}</div>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-800/60">
            {timeSlots.map((slot) => (
              <div key={slot} className="grid grid-cols-5 gap-3 py-3 items-center text-xs">
                <div className="font-bold text-slate-400">{slot}</div>
                {staffList.slice(0, 4).map((staff) => {
                  const app = appointments.find(
                    (a) => a.staffId?._id === staff._id && a.startTime.startsWith(slot.split(':')[0])
                  );
                  return (
                    <div
                      key={staff._id}
                      className={`p-2.5 rounded-xl border min-h-[56px] flex flex-col justify-between transition-all ${
                        app
                          ? 'bg-brand-500/15 border-brand-500/30 text-brand-200'
                          : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 text-slate-600'
                      }`}
                    >
                      {app ? (
                        <>
                          <div className="font-bold text-[11px] text-white line-clamp-1">{app.customerName}</div>
                          <div className="text-[10px] text-brand-300 line-clamp-1">{app.serviceName}</div>
                        </>
                      ) : (
                        <span className="text-[10px] opacity-40">Available</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-400" /> New Appointment Booking
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Customer</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="input-field"
                >
                  <option value="">-- Choose Client --</option>
                  {customersList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Required</label>
                <select
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="input-field"
                >
                  <option value="">-- Choose Service --</option>
                  {servicesList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} (₹{s.basePrice} - {s.durationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stylist / Therapist</label>
                  <select
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Any Available</option>
                    {staffList.map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs mt-2">
                Confirm & Schedule Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
