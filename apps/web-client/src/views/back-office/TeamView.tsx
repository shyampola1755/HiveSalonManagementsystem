import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Plus,
  X,
  Mail,
  Lock,
  Building2,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { activeBranchId, branches } = useAuth();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'ATTENDANCE'>('DIRECTORY');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: 'Password123!',
    phone: '',
    role: 'BRANCH_MANAGER',
    staffType: 'MANAGER',
    jobTitle: 'Branch Operations Manager',
    primaryBranchId: '',
    commissionRate: 15,
    monthlyRevenueTarget: 100000,
    specialization: 'Branch Management & VIP Care',
  });

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

  useEffect(() => {
    if (branches && branches.length > 0 && !formData.primaryBranchId) {
      setFormData((prev) => ({
        ...prev,
        primaryBranchId: String(branches[0].id || (branches[0] as any)._id),
      }));
    }
  }, [branches]);

  const handleRoleChange = (newRole: string) => {
    let defaultType = 'STYLIST';
    let defaultTitle = 'Senior Stylist';
    let defaultComm = 20;

    if (newRole === 'BRANCH_MANAGER') {
      defaultType = 'MANAGER';
      defaultTitle = 'Branch Operations Manager';
      defaultComm = 10;
    } else if (newRole === 'FRONT_DESK') {
      defaultType = 'FRONT_DESK';
      defaultTitle = 'Front Desk & POS Coordinator';
      defaultComm = 5;
    }

    setFormData((prev) => ({
      ...prev,
      role: newRole,
      staffType: defaultType,
      jobTitle: defaultTitle,
      commissionRate: defaultComm,
    }));
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.primaryBranchId && branches.length > 0) {
      formData.primaryBranchId = String(branches[0].id || (branches[0] as any)._id);
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/staff', {
        ...formData,
        specialization: formData.specialization ? [formData.specialization] : [],
      });
      if (res.data.success) {
        showToast(`Staff member & login created for ${formData.fullName}!`, 'success');
        setShowAddModal(false);
        setFormData({
          fullName: '',
          email: '',
          password: 'Password123!',
          phone: '',
          role: 'BRANCH_MANAGER',
          staffType: 'MANAGER',
          jobTitle: 'Branch Operations Manager',
          primaryBranchId: branches[0] ? String(branches[0].id || (branches[0] as any)._id) : '',
          commissionRate: 15,
          monthlyRevenueTarget: 100000,
          specialization: 'Branch Management & VIP Care',
        });
        await fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create staff member', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 glass-card p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Staff Roster, Stylists & Attendance</h2>
            <p className="text-xs text-slate-500">
              Employee profiles, branch login credentials, commission structures, and attendance
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold text-xs font-bold px-3 sm:px-4 py-2 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Staff / Login
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('DIRECTORY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'DIRECTORY' ? 'bg-brand-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff Directory ({staff.length})
            </button>
            <button
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ATTENDANCE' ? 'bg-brand-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance Logs
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'DIRECTORY' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {staff.map((member) => (
            <div key={member._id || member.id} className="glass-card p-4 sm:p-6 border-slate-200 bg-white flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-start">
                  <span className="badge-gold text-[10px] font-mono">{member.employeeCode}</span>
                  <span className="badge-emerald text-[10px]">{member.staffType}</span>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-brand-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm sm:text-base shadow-sm shrink-0">
                    {member.displayName?.charAt(0) || 'S'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{member.displayName}</h3>
                    <p className="text-xs text-brand-600 font-semibold">{member.jobTitle}</p>
                    {member.userId?.email && (
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{member.userId.email}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Branch:</span>
                    <span className="font-bold text-brand-600 truncate max-w-[140px] text-right">
                      {member.primaryBranchId?.name || 'All Branches'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Login Role:</span>
                    <span className="font-bold text-purple-700">
                      {member.userId?.role?.replace('_', ' ') || member.staffType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Commission Rate:</span>
                    <span className="font-bold text-emerald-600">{member.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Target:</span>
                    <span className="font-bold text-slate-900">₹{member.monthlyRevenueTarget?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Login Ready
                </span>
                <span className="text-slate-500 font-mono text-[11px]">{member.primaryBranchId?.code || 'HQ'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 min-w-[600px]">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3 sm:p-4">Staff Member</th>
                  <th className="p-3 sm:p-4">Employee ID</th>
                  <th className="p-3 sm:p-4">Check-in Time</th>
                  <th className="p-3 sm:p-4">Check-out Time</th>
                  <th className="p-3 sm:p-4">Total Working Hours</th>
                  <th className="p-3 sm:p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No attendance records found for today.
                    </td>
                  </tr>
                ) : (
                  attendance.map((rec) => (
                    <tr key={rec._id || rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-slate-900">{rec.staffId?.displayName}</td>
                      <td className="p-3 sm:p-4 font-mono text-slate-500">{rec.staffId?.employeeCode}</td>
                      <td className="p-3 sm:p-4 text-emerald-600 font-mono font-medium">
                        {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="p-3 sm:p-4 text-slate-500 font-mono">
                        {rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'On Floor'}
                      </td>
                      <td className="p-3 sm:p-4 font-bold text-slate-900">{rec.totalWorkingHours || 'Active'} hrs</td>
                      <td className="p-3 sm:p-4">
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

      {/* Add Staff / Branch Login Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-lg w-full glass-card p-5 sm:p-6 border-slate-200 bg-white max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-600" /> Create Staff Member & Branch Login
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Creates employee profile and user login credentials for the assigned branch
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Kavya Rao"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Login Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kavya@hivesalon.com"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password123!"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Login Role & Permissions *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="input-field"
                  >
                    <option value="BRANCH_MANAGER">🏢 Branch Manager (Floor ERP Scoped)</option>
                    <option value="FRONT_DESK">⚡ Front Desk Coordinator (POS & Queue)</option>
                    <option value="STYLIST">✂️ Creative Stylist (Station & Calendar)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary Salon Branch *</label>
                  <select
                    value={formData.primaryBranchId}
                    onChange={(e) => setFormData({ ...formData, primaryBranchId: e.target.value })}
                    className="input-field"
                  >
                    {branches.map((b) => (
                      <option key={b.id || (b as any)._id} value={String(b.id || (b as any)._id)}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Job Designation Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g. Master Balayage Director"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Monthly Sales Target (INR)</label>
                  <input
                    type="number"
                    value={formData.monthlyRevenueTarget}
                    onChange={(e) => setFormData({ ...formData, monthlyRevenueTarget: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specialization / Skills</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. French Balayage, Keratin Treatments"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold w-full py-2.5 font-bold text-xs shadow-md mt-2"
              >
                {isSubmitting ? 'Creating Employee Profile...' : 'Save & Provision Branch Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
