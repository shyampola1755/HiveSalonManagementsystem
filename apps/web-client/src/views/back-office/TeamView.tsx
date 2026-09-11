import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Users, Clock, Calendar, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const TeamView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'ATTENDANCE'>('DIRECTORY');

  const fetchData = async () => {
    try {
      const [sRes, aRes] = await Promise.all([
        apiClient.get('/staff'),
        apiClient.get('/staff/attendance'),
      ]);
      if (sRes.data.success) setStaff(sRes.data.data);
      if (aRes.data.success) setAttendance(aRes.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeBranchId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Staff Roster, Stylists & Attendance</h2>
            <p className="text-xs text-slate-400">Employee profiles, commission structures, shifts, and biometric clock logs</p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'DIRECTORY' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff Directory ({staff.length})
          </button>
          <button
            onClick={() => setActiveTab('ATTENDANCE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ATTENDANCE' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today's Attendance Logs
          </button>
        </div>
      </div>

      {activeTab === 'DIRECTORY' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div key={member._id} className="glass-card p-6 border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="badge-gold text-[10px] font-mono">{member.employeeCode}</span>
                  <span className="badge-emerald text-[10px]">{member.staffType}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-base shadow-sm">
                    {member.displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{member.displayName}</h3>
                    <p className="text-xs text-brand-300 font-medium">{member.jobTitle}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commission Rate:</span>
                    <span className="font-bold text-emerald-400">{member.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Target:</span>
                    <span className="font-bold text-white">₹{member.monthlyRevenueTarget?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Specialization:</span>
                    <span className="text-slate-200 line-clamp-1">{member.specialization?.join(', ') || 'General'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Available for Booking
                </span>
                <span className="text-slate-400 text-[11px]">{member.primaryBranchId?.name || 'Main Branch'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Check-in Time</th>
                  <th className="p-4">Check-out Time</th>
                  <th className="p-4">Total Working Hours</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No attendance records found for today.
                    </td>
                  </tr>
                ) : (
                  attendance.map((rec) => (
                    <tr key={rec._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{rec.staffId?.displayName}</td>
                      <td className="p-4 font-mono text-slate-400">{rec.staffId?.employeeCode}</td>
                      <td className="p-4 text-emerald-400 font-mono">
                        {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="p-4 text-slate-400 font-mono">
                        {rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'On Floor'}
                      </td>
                      <td className="p-4 font-bold text-white">{rec.totalWorkingHours || 'Active'} hrs</td>
                      <td className="p-4">
                        <span className="badge-emerald text-[10px]">{rec.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
