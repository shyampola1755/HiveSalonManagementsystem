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
  AlertTriangle,
  Info,
  CalendarDays,
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export const CalendarView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();

  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTomorrowDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    const h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
  };

  const isSlotInPast = (dateStr: string, timeStr: string) => {
    const todayStr = getTodayDateStr();
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [slotH, slotM] = (timeStr || '00:00').split(':').map(Number);
    const slotMinutes = slotH * 60 + (slotM || 0);

    return slotMinutes <= currentMinutes;
  };

  const getFirstAvailableSlot = (dateStr: string) => {
    const available = TIME_SLOTS.find((s) => !isSlotInPast(dateStr, s));
    return available || '09:00';
  };

  const todayDateStr = getTodayDateStr();
  const tomorrowDateStr = getTomorrowDateStr();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);

  // Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    serviceId: '',
    staffId: '',
    startTime: getFirstAvailableSlot(todayDateStr),
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

  // Update default slot when modal opens or date changes
  const handleOpenBookingModal = (defaultStaffId = '', defaultSlot = '') => {
    const slotToUse = defaultSlot || (isSlotInPast(selectedDate, formData.startTime) ? getFirstAvailableSlot(selectedDate) : formData.startTime);
    setFormData((prev) => ({
      ...prev,
      staffId: defaultStaffId || prev.staffId,
      startTime: slotToUse,
    }));
    setShowBookingModal(true);
  };

  const handleDateChange = (newDate: string) => {
    if (newDate < todayDateStr) {
      showToast('Cannot view or schedule appointments for past dates.', 'warning');
      setSelectedDate(todayDateStr);
      return;
    }
    setSelectedDate(newDate);
    // If current selected time in modal is in past for new date, update it
    if (isSlotInPast(newDate, formData.startTime)) {
      setFormData((prev) => ({ ...prev, startTime: getFirstAvailableSlot(newDate) }));
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation: Prevent booking in the past
    if (isSlotInPast(selectedDate, formData.startTime)) {
      showToast('Cannot schedule appointments in the past. Please select an upcoming date and time.', 'error');
      return;
    }

    if (!formData.customerId) {
      showToast('Please select a customer.', 'error');
      return;
    }

    if (!formData.serviceId) {
      showToast('Please select a service.', 'error');
      return;
    }

    // 2. Validation: Customer Concurrent / Overlapping Appointment Check
    const [newH, newM] = formData.startTime.split(':').map(Number);
    const newStartMin = newH * 60 + (newM || 0);
    const newEndMin = newStartMin + (Number(formData.durationMinutes) || 60);

    const selectedCustomer = customersList.find((c) => c._id === formData.customerId || c.id === formData.customerId);
    const customerDisplayName = selectedCustomer?.fullName || 'Selected Client';

    const customerConflict = appointments.find((a) => {
      if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;

      // Check date match
      const apptDateStr = a.appointmentDate ? (typeof a.appointmentDate === 'string' ? a.appointmentDate.split('T')[0] : '') : selectedDate;
      if (apptDateStr && apptDateStr !== selectedDate) return false;

      const apptCustId = a.customerId?._id || a.customerId?.id || a.customerId;
      const isSameCust = apptCustId === formData.customerId || (a.customerName && selectedCustomer && a.customerName.toLowerCase() === selectedCustomer.fullName.toLowerCase());
      if (!isSameCust) return false;

      const [aH, aM] = (a.startTime || '00:00').split(':').map(Number);
      const aStartMin = aH * 60 + (aM || 0);
      let aEndMin = aStartMin + (Number(a.durationMinutes) || 60);
      if (a.endTime) {
        const [eH, eM] = a.endTime.split(':').map(Number);
        aEndMin = eH * 60 + (eM || 0);
      }

      // Overlap: newStart < aEnd && newEnd > aStart
      return newStartMin < aEndMin && newEndMin > aStartMin;
    });

    if (customerConflict) {
      showToast(
        `Client ${customerDisplayName} already has an active appointment at ${formatTime12h(customerConflict.startTime)} with ${customerConflict.staffName || customerConflict.staffId?.displayName || 'a stylist'}. Concurrent appointments for the same client are not allowed.`,
        'error'
      );
      return;
    }

    // 3. Validation: Stylist Overlapping Appointment Check
    if (formData.staffId) {
      const selectedStaff = staffList.find((s) => s._id === formData.staffId || s.id === formData.staffId);
      const staffDisplayName = selectedStaff?.displayName || 'Selected Stylist';

      const staffConflict = appointments.find((a) => {
        if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;

        const apptDateStr = a.appointmentDate ? (typeof a.appointmentDate === 'string' ? a.appointmentDate.split('T')[0] : '') : selectedDate;
        if (apptDateStr && apptDateStr !== selectedDate) return false;

        const apptStaffId = a.staffId?._id || a.staffId?.id || a.staffId;
        const isSameStaff = apptStaffId === formData.staffId || (a.staffName && selectedStaff && a.staffName.toLowerCase() === selectedStaff.displayName.toLowerCase());
        if (!isSameStaff) return false;

        const [aH, aM] = (a.startTime || '00:00').split(':').map(Number);
        const aStartMin = aH * 60 + (aM || 0);
        let aEndMin = aStartMin + (Number(a.durationMinutes) || 60);
        if (a.endTime) {
          const [eH, eM] = a.endTime.split(':').map(Number);
          aEndMin = eH * 60 + (eM || 0);
        }

        return newStartMin < aEndMin && newEndMin > aStartMin;
      });

      if (staffConflict) {
        showToast(
          `Stylist ${staffDisplayName} is already booked at ${formatTime12h(staffConflict.startTime)} for another client (${staffConflict.customerName || 'Client'}). Please choose a different stylist or time slot.`,
          'error'
        );
        return;
      }
    }

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

  const allSlotsPassedToday = selectedDate === todayDateStr && TIME_SLOTS.every((s) => isSlotInPast(selectedDate, s));

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
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-400">
                Resource board for <span className="text-white font-semibold">{selectedDate}</span>
              </p>
              {selectedDate === todayDateStr && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Today
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => handleDateChange(todayDateStr)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                selectedDate === todayDateStr
                  ? 'bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleDateChange(tomorrowDateStr)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                selectedDate === tomorrowDateStr
                  ? 'bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tomorrow
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              min={todayDateStr}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input-field py-1.5 px-3 text-xs w-auto cursor-pointer"
            />
            <button
              onClick={() => handleOpenBookingModal()}
              className="btn-gold text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-lg shadow-brand-500/10"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Notice if all slots for today have passed */}
      {allSlotsPassedToday && (
        <div className="glass-card p-4 border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Salon appointment hours for today have completed. Switch to tomorrow to schedule upcoming bookings.</span>
          </div>
          <button
            onClick={() => handleDateChange(tomorrowDateStr)}
            className="btn-secondary py-1 px-3 text-xs shrink-0 font-semibold"
          >
            View Tomorrow's Schedule
          </button>
        </div>
      )}

      {/* Calendar Grid by Stylists */}
      <div className="glass-card p-5 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row: Stylists */}
          <div className="grid grid-cols-5 gap-3 pb-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-400" /> Time Slot
            </div>
            {staffList.slice(0, 4).map((staff) => (
              <div key={staff._id} className="text-center font-bold text-slate-200">
                {staff.displayName}
                <div className="text-[10px] text-brand-400 font-normal">{staff.jobTitle}</div>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-800/60">
            {TIME_SLOTS.map((slot) => {
              const slotPassed = isSlotInPast(selectedDate, slot);

              return (
                <div key={slot} className={`grid grid-cols-5 gap-3 py-3 items-center text-xs ${slotPassed ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${slotPassed ? 'text-slate-500' : 'text-slate-300'}`}>
                      {formatTime12h(slot)}
                    </span>
                    {slotPassed && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 font-medium">
                        Passed
                      </span>
                    )}
                  </div>

                  {staffList.slice(0, 4).map((staff) => {
                    const app = appointments.find((a) => {
                      if (a.status === 'CANCELLED') return false;
                      const staffMatch = (a.staffId?._id || a.staffId) === staff._id || a.staffName === staff.displayName;
                      const timeMatch = a.startTime?.startsWith(slot.split(':')[0]);
                      return staffMatch && timeMatch;
                    });

                    if (app) {
                      return (
                        <div
                          key={staff._id}
                          className={`p-2.5 rounded-xl border min-h-[58px] flex flex-col justify-between transition-all ${
                            slotPassed
                              ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                              : 'bg-brand-500/15 border-brand-500/40 text-brand-200 shadow-sm shadow-brand-500/5'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[11px] text-white line-clamp-1">
                              {app.customerName || app.customerId?.fullName || 'Client'}
                            </div>
                            <div className="text-[10px] text-brand-300 line-clamp-1">
                              {app.serviceName || app.serviceId?.name || 'Service'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                            <span>{app.startTime} - {app.endTime || 'Done'}</span>
                            <span className={`px-1 rounded text-[8px] font-bold ${
                              app.status === 'IN_SERVICE' ? 'bg-amber-500/20 text-amber-300' :
                              app.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                              'bg-brand-500/20 text-brand-300'
                            }`}>
                              {app.status || 'SCHEDULED'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    if (slotPassed) {
                      return (
                        <div
                          key={staff._id}
                          className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/20 text-slate-600 min-h-[58px] flex flex-col justify-center items-center cursor-not-allowed select-none"
                        >
                          <span className="text-[10px] text-slate-600 italic">Slot Passed</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={staff._id}
                        onClick={() => handleOpenBookingModal(staff._id, slot)}
                        className="p-2.5 rounded-xl border border-slate-800/60 hover:border-brand-500/50 bg-slate-950/40 hover:bg-brand-500/10 cursor-pointer text-slate-500 hover:text-brand-300 min-h-[58px] flex flex-col justify-center items-center transition-all group"
                      >
                        <span className="text-[10px] group-hover:font-bold flex items-center gap-1">
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" /> Available
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">New Appointment Booking</h3>
                  <p className="text-[11px] text-slate-400">
                    Scheduling for <span className="text-brand-300 font-semibold">{selectedDate}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              {/* Date Selection inside modal */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Appointment Date</label>
                <input
                  type="date"
                  min={todayDateStr}
                  required
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Customer Selector */}
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
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.fullName} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Required */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Required</label>
                <select
                  required
                  value={formData.serviceId}
                  onChange={(e) => {
                    const svcId = e.target.value;
                    const found = servicesList.find((s) => s._id === svcId || s.id === svcId);
                    setFormData({
                      ...formData,
                      serviceId: svcId,
                      durationMinutes: found ? found.durationMinutes : 60,
                    });
                  }}
                  className="input-field"
                >
                  <option value="">-- Choose Service --</option>
                  {servicesList.map((s) => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.name} (₹{s.basePrice} • {s.durationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              {/* Stylist and Start Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stylist / Therapist</label>
                  <select
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Any Available Stylist</option>
                    {staffList.map((st) => (
                      <option key={st._id || st.id} value={st._id || st.id}>
                        {st.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time Slot</label>
                  <select
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input-field"
                  >
                    {TIME_SLOTS.map((slot) => {
                      const isPast = isSlotInPast(selectedDate, slot);
                      return (
                        <option key={slot} value={slot} disabled={isPast} className={isPast ? 'text-slate-600 bg-slate-900' : ''}>
                          {formatTime12h(slot)} {isPast ? '(Passed)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Special Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sensitive scalp, preferred styling product"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Notice if selected time is in the past */}
              {isSlotInPast(selectedDate, formData.startTime) && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>The selected time slot has already passed. Please choose an upcoming time slot or change date.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSlotInPast(selectedDate, formData.startTime)}
                className="btn-gold w-full py-2.5 font-bold text-xs mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
              >
                Confirm & Schedule Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
