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
  UserCheck,
  Sparkles,
  Phone,
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
      const bParam = activeBranchId ? `&branchId=${encodeURIComponent(activeBranchId)}` : '';
      const [appRes, staffRes, svcRes, custRes] = await Promise.all([
        apiClient.get(`/appointments?date=${selectedDate}${bParam}`),
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
      console.error('Error fetching calendar data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, activeBranchId]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const firstAvail = getFirstAvailableSlot(newDate);
    setFormData((prev) => ({
      ...prev,
      startTime: firstAvail,
    }));
  };

  const handleOpenBookingModal = (defaultStaffId = '', defaultSlot = '') => {
    const slotToUse = defaultSlot || getFirstAvailableSlot(selectedDate);
    setFormData({
      customerId: customersList[0]?._id || '',
      serviceId: servicesList[0]?._id || '',
      staffId: defaultStaffId,
      startTime: slotToUse,
      durationMinutes: servicesList[0]?.durationMinutes || 60,
      notes: '',
    });
    setShowBookingModal(true);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSlotInPast(selectedDate, formData.startTime)) {
      showToast('Cannot book appointment in a past time slot.', 'error');
      return;
    }

    let assignedStaffId = formData.staffId;
    let assignedStaffDisplayName = '';

    if (assignedStaffId) {
      const [newH, newM] = formData.startTime.split(':').map(Number);
      const newStartMin = newH * 60 + newM;
      const newEndMin = newStartMin + Number(formData.durationMinutes);

      const conflict = appointments.some((a) => {
        if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;

        const apptDateStr = a.appointmentDate ? (typeof a.appointmentDate === 'string' ? a.appointmentDate.split('T')[0] : '') : selectedDate;
        if (apptDateStr && apptDateStr !== selectedDate) return false;

        const apptStaffId = a.staffId?._id || a.staffId?.id || a.staffId;
        const matchedStaff = staffList.find((s) => s._id === assignedStaffId);
        const isSameStaff = apptStaffId === assignedStaffId || (matchedStaff && a.staffName && a.staffName.toLowerCase() === matchedStaff.displayName.toLowerCase());
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

      if (conflict) {
        showToast('Selected stylist is already booked during this time window. Please choose another stylist or time slot.', 'error');
        return;
      }
    } else {
      const [newH, newM] = formData.startTime.split(':').map(Number);
      const newStartMin = newH * 60 + newM;
      const newEndMin = newStartMin + Number(formData.durationMinutes);

      const freeStaff = staffList.find((st) => {
        const conflict = appointments.some((a) => {
          if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;

          const apptDateStr = a.appointmentDate ? (typeof a.appointmentDate === 'string' ? a.appointmentDate.split('T')[0] : '') : selectedDate;
          if (apptDateStr && apptDateStr !== selectedDate) return false;

          const apptStaffId = a.staffId?._id || a.staffId?.id || a.staffId;
          const isSameStaff = apptStaffId === st._id || apptStaffId === st.id || (a.staffName && a.staffName.toLowerCase() === st.displayName.toLowerCase());
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

        return !conflict;
      });

      if (freeStaff) {
        assignedStaffId = freeStaff._id || freeStaff.id;
        assignedStaffDisplayName = freeStaff.displayName;
      } else if (staffList.length > 0) {
        showToast('All stylists are fully booked for this time slot. Please choose another time slot.', 'error');
        return;
      }
    }

    try {
      const res = await apiClient.post('/appointments', {
        ...formData,
        branchId: activeBranchId,
        staffId: assignedStaffId,
        appointmentDate: selectedDate,
      });
      if (res.data.success) {
        const msg = assignedStaffDisplayName
          ? `Appointment booked & assigned to ${assignedStaffDisplayName}!`
          : 'Appointment booked successfully!';
        showToast(msg, 'success');
        setShowBookingModal(false);
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to book appointment', 'error');
    }
  };

  const allSlotsPassedToday = selectedDate === todayDateStr && TIME_SLOTS.every((s) => isSlotInPast(selectedDate, s));

  // Check if there are any unassigned appointments for this date
  const unassignedAppts = appointments.filter((a) => {
    if (a.status === 'CANCELLED') return false;
    const aDateStr = a.appointmentDate ? (typeof a.appointmentDate === 'string' ? a.appointmentDate.split('T')[0] : '') : selectedDate;
    if (aDateStr && aDateStr !== selectedDate) return false;
    const hasStaff = staffList.some((s) => (a.staffId?._id || a.staffId) === s._id || a.staffName === s.displayName);
    return !hasStaff;
  });

  const displayStaffList = staffList.slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 glass-card p-3.5 sm:p-5 bg-white border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Appointments & Stylist Calendar</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-500">
                Resource board for <span className="text-slate-900 font-semibold">{selectedDate}</span>
              </p>
              {selectedDate === todayDateStr && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Today
                </span>
              )}
              <span className="text-xs text-slate-400 font-medium">
                • {appointments.length} Booked
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Buttons */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => handleDateChange(todayDateStr)}
              className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                selectedDate === todayDateStr
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleDateChange(tomorrowDateStr)}
              className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                selectedDate === tomorrowDateStr
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tomorrow
            </button>
          </div>

          <div className="flex items-center gap-1.5 w-full xs:w-auto">
            <input
              type="date"
              min={todayDateStr}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input-field py-1.5 px-2.5 text-xs w-auto cursor-pointer"
            />
            <button
              onClick={() => handleOpenBookingModal()}
              className="btn-gold text-xs font-bold px-3 sm:px-4 py-2 flex items-center gap-1.5 shadow-sm shrink-0 flex-1 xs:flex-none justify-center"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Notice if all slots for today have passed */}
      {allSlotsPassedToday && (
        <div className="glass-card p-3 sm:p-4 border-amber-200 bg-amber-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
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

      {/* Calendar Grid by Stylists with responsive horizontal scroll */}
      <div className="glass-card p-3.5 sm:p-5 overflow-x-auto bg-white border-slate-200/80 shadow-sm">
        <div className="min-w-[700px] md:min-w-[850px]">
          {/* Header Row: Stylists + Unassigned (if any) */}
          <div
            className="grid gap-2.5 sm:gap-3 pb-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider"
            style={{
              gridTemplateColumns: `110px repeat(${displayStaffList.length + (unassignedAppts.length > 0 ? 1 : 0)}, minmax(140px, 1fr))`,
            }}
          >
            <div>Time Slot</div>
            {displayStaffList.map((staff) => (
              <div key={staff._id} className="text-center font-bold text-slate-800">
                {staff.displayName}
                <div className="text-[10px] text-brand-600 font-normal">{staff.jobTitle}</div>
              </div>
            ))}
            {unassignedAppts.length > 0 && (
              <div className="text-center font-bold text-amber-700">
                Unassigned / Queue
                <div className="text-[10px] text-amber-600 font-normal">Pending Stylist</div>
              </div>
            )}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-100">
            {TIME_SLOTS.map((slot) => {
              const slotPassed = isSlotInPast(selectedDate, slot);

              return (
                <div
                  key={slot}
                  className={`grid gap-2.5 sm:gap-3 py-2.5 sm:py-3 items-center text-xs ${slotPassed ? 'opacity-60' : ''}`}
                  style={{
                    gridTemplateColumns: `110px repeat(${displayStaffList.length + (unassignedAppts.length > 0 ? 1 : 0)}, minmax(140px, 1fr))`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold ${slotPassed ? 'text-slate-400' : 'text-slate-700'}`}>
                      {formatTime12h(slot)}
                    </span>
                    {slotPassed && (
                      <span className="text-[8px] px-1 py-0.5 rounded bg-slate-100 text-slate-500 font-medium hidden sm:inline">
                        Passed
                      </span>
                    )}
                  </div>

                  {/* Stylist Columns */}
                  {displayStaffList.map((staff) => {
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
                          className={`p-2 sm:p-2.5 rounded-xl border min-h-[56px] flex flex-col justify-between transition-all ${
                            slotPassed
                              ? 'bg-slate-50 border-slate-200 text-slate-500'
                              : 'bg-amber-50/80 border-amber-200 text-slate-800 shadow-sm'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[11px] text-slate-900 line-clamp-1">
                              {app.customerName || app.customerId?.fullName || 'Client'}
                            </div>
                            <div className="text-[10px] text-brand-700 line-clamp-1">
                              {app.serviceName || app.serviceId?.name || 'Service'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1">
                            <span>{app.startTime} - {app.endTime || 'Done'}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                              app.status === 'IN_SERVICE' ? 'bg-amber-100 text-amber-800' :
                              app.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-brand-100 text-brand-800'
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
                          className="p-2 sm:p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 text-slate-400 min-h-[56px] flex flex-col justify-center items-center cursor-not-allowed select-none"
                        >
                          <span className="text-[10px] text-slate-400 italic">Slot Passed</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={staff._id}
                        onClick={() => handleOpenBookingModal(staff._id, slot)}
                        className="p-2 sm:p-2.5 rounded-xl border border-dashed border-slate-200 hover:border-brand-500 bg-white hover:bg-brand-50/40 cursor-pointer text-slate-400 hover:text-brand-600 min-h-[56px] flex flex-col justify-center items-center transition-all group shadow-sm"
                      >
                        <span className="text-[10px] group-hover:font-bold flex items-center gap-1">
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-500" /> Available
                        </span>
                      </div>
                    );
                  })}

                  {/* Unassigned column if any unassigned exist */}
                  {unassignedAppts.length > 0 && (() => {
                    const unassignedSlotApp = unassignedAppts.find((a) => a.startTime?.startsWith(slot.split(':')[0]));
                    if (unassignedSlotApp) {
                      return (
                        <div className="p-2 sm:p-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 min-h-[56px] flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-[11px] text-slate-900 line-clamp-1">{unassignedSlotApp.customerName}</div>
                            <div className="text-[10px] text-amber-700 line-clamp-1">{unassignedSlotApp.serviceName}</div>
                          </div>
                          <div className="text-[9px] text-amber-700">Any Available Stylist</div>
                        </div>
                      );
                    }
                    return (
                      <div className="p-2 sm:p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 min-h-[56px] flex items-center justify-center text-[10px]">
                        -
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Scheduled Appointments Ledger & Details Table */}
      <div className="glass-card p-3.5 sm:p-5 bg-white border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 sm:mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Scheduled Appointments for {selectedDate} ({appointments.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {appointments.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length} upcoming
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-slate-400 text-xs">
            No appointments scheduled for {selectedDate}. Click "Book Appointment" or an available slot above to schedule.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="text-[11px] text-slate-500 border-b border-slate-200 uppercase tracking-wider bg-slate-50/60">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Time Slot</th>
                  <th className="py-2.5 px-3 font-bold">Client / Phone</th>
                  <th className="py-2.5 px-3 font-bold">Service</th>
                  <th className="py-2.5 px-3 font-bold">Assigned Stylist</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                  <th className="py-2.5 px-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((a) => (
                  <tr key={a._id || a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      {a.startTime} {a.endTime ? `- ${a.endTime}` : ''}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{a.customerName || a.customerId?.fullName || 'Client'}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {a.customerPhone || a.customerId?.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{a.serviceName || a.serviceId?.name}</div>
                      <div className="text-[10px] text-slate-400">{a.durationMinutes || 60} mins</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                        <User className="w-3 h-3 text-brand-600" />
                        {a.staffName || a.staffId?.displayName || 'Any Available Stylist'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === 'IN_SERVICE' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-brand-100 text-brand-800 border border-brand-200'
                      }`}>
                        {a.status || 'SCHEDULED'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{a.totalPrice || a.serviceId?.basePrice || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-lg w-full glass-card p-5 sm:p-6 bg-white border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">New Appointment Booking</h3>
                  <p className="text-[11px] text-slate-500">
                    Scheduling for <span className="text-brand-700 font-semibold">{selectedDate}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              {/* Date Selection inside modal */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Appointment Date</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Select Customer</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Service Required</label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stylist / Therapist</label>
                  <select
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">✨ Any Available Stylist (Auto-Assign)</option>
                    {staffList.map((st) => (
                      <option key={st._id || st.id} value={st._id || st.id}>
                        {st.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Time Slot</label>
                  <select
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input-field"
                  >
                    {TIME_SLOTS.map((slot) => {
                      const isPast = isSlotInPast(selectedDate, slot);
                      return (
                        <option key={slot} value={slot} disabled={isPast} className={isPast ? 'text-slate-400 bg-slate-100' : ''}>
                          {formatTime12h(slot)} {isPast ? '(Passed)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes / Special Instructions (Optional)</label>
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
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>The selected time slot has already passed. Please choose an upcoming time slot or change date.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSlotInPast(selectedDate, formData.startTime)}
                className="btn-gold w-full py-2.5 font-bold text-xs mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
