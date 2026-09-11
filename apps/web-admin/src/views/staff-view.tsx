'use client';

import * as React from 'react';
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  useToast,
  Card,
  StatCard,
  Tabs,
} from '@hive/ui';
import {
  Users,
  Clock,
  Calendar,
  CalendarCheck,
  Award,
  TrendingUp,
  UserCheck,
  UserX,
  Coffee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search as SearchIcon,
  RefreshCw,
  Sparkles,
  Fingerprint,
  FileText,
  DollarSign,
  Briefcase,
  Scissors,
  Check,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Flame,
  UserPlus,
  LogOut,
  LogIn,
  SlidersHorizontal,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  StaffMemberDetail,
  CreateStaffDto,
  UpdateStaffDto,
  ShiftTemplateDetail,
  CreateShiftTemplateDto,
  StaffRosterDetail,
  RosterAssignmentPayload,
  AttendanceRecordDetail,
  AttendancePunchPayload,
  ManualAttendancePayload,
  LeaveRequestDetail,
  ApplyLeavePayload,
  ReviewLeavePayload,
  LeaveBalanceDetail,
  StaffDashboardSummary,
  StaffManagerOverview,
  StaffRoleType,
  StaffStatus,
  AttendanceStatus,
  CheckInMethod,
  LeaveType,
} from '@hive/types';

// Mock Branch Options
const branchOptions = [
  { value: 'ALL', label: '🏢 All Branches (Enterprise View)' },
  { value: 'br-jubilee', label: '📍 Jubilee Hills Flagship (HYD)' },
  { value: 'br-banjara', label: '📍 Banjara Hills Spa & Lounge (HYD)' },
  { value: 'br-hitech', label: '📍 Hitech City Express (HYD)' },
  { value: 'br-indiranagar', label: '📍 Indiranagar Sanctuary (BLR)' },
];

// 10 Staff Role Definitions
const staffRoleOptions: { value: StaffRoleType; label: string; icon: string }[] = [
  { value: 'STYLIST', label: 'Master Stylist / Colorist', icon: '✂️' },
  { value: 'HAIRDRESSER', label: 'Hairdresser & Blowdry Specialist', icon: '💇' },
  { value: 'BEAUTICIAN', label: 'Senior Beautician & Skin Expert', icon: '✨' },
  { value: 'THERAPIST', label: 'Spa Therapist & Reflexologist', icon: '💆' },
  { value: 'NAIL_ARTIST', label: 'Nail Artist & Gel Technician', icon: '💅' },
  { value: 'MAKEUP_ARTIST', label: 'Bridal & Editorial Makeup Artist', icon: '💄' },
  { value: 'TATTOO_ARTIST', label: 'Tattoo & Body Art Specialist', icon: '🖋️' },
  { value: 'FRONT_DESK', label: 'Front Desk & Guest Concierge', icon: '🛎️' },
  { value: 'MANAGER', label: 'Salon Operations Manager', icon: '👔' },
  { value: 'ACCOUNTANT', label: 'Finance & Accounts Executive', icon: '📊' },
];

const staffRoleBadges: Record<StaffRoleType, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  STYLIST: { label: 'Master Stylist', variant: 'default' },
  HAIRDRESSER: { label: 'Hairdresser', variant: 'secondary' },
  BEAUTICIAN: { label: 'Beautician', variant: 'success' },
  THERAPIST: { label: 'Spa Therapist', variant: 'warning' },
  NAIL_ARTIST: { label: 'Nail Artist', variant: 'default' },
  MAKEUP_ARTIST: { label: 'Makeup Artist', variant: 'secondary' },
  TATTOO_ARTIST: { label: 'Tattoo Artist', variant: 'destructive' },
  FRONT_DESK: { label: 'Front Desk', variant: 'secondary' },
  MANAGER: { label: 'Branch Manager', variant: 'success' },
  ACCOUNTANT: { label: 'Accountant', variant: 'warning' },
};

const attendanceStatusBadges: Record<AttendanceStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  PRESENT: { label: 'Present (On Time)', variant: 'success' },
  LATE: { label: 'Late Arrival', variant: 'warning' },
  HALF_DAY: { label: 'Half Day', variant: 'secondary' },
  ON_LEAVE: { label: 'On Approved Leave', variant: 'secondary' },
  ABSENT: { label: 'Absent', variant: 'destructive' },
  OVERTIME: { label: 'Overtime', variant: 'success' },
};

const leaveTypeBadges: Record<LeaveType, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  CASUAL_LEAVE: { label: 'Casual Leave (CL)', variant: 'default' },
  SICK_LEAVE: { label: 'Sick Leave (SL)', variant: 'warning' },
  EARNED_LEAVE: { label: 'Earned / Privilege Leave (EL)', variant: 'success' },
  MATERNITY_PATERNITY: { label: 'Maternity / Paternity Leave', variant: 'secondary' },
  UNPAID_LEAVE: { label: 'Unpaid Leave (LOP)', variant: 'destructive' },
};

export interface StaffPageProps {
  initialTab?: string;
  initialMode?: 'PORTAL' | 'MANAGER';
  params?: Promise<Record<string, string | string[] | undefined>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function StaffView({ initialTab = 'overview', initialMode = 'MANAGER' }: { initialTab?: string; initialMode?: 'PORTAL' | 'MANAGER' }) {
  const toast = useToast();

  // Mode Switcher: 'PORTAL' (Employee Self-Service) vs 'MANAGER' (Manager Administration Hub)
  const [viewMode, setViewMode] = React.useState<'PORTAL' | 'MANAGER'>(initialMode);

  // Active Global Filters
  const [selectedBranch, setSelectedBranch] = React.useState<string>('ALL');
  const [managerTab, setManagerTab] = React.useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>('ALL');

  // Currently logged-in employee persona (default: Priya Sharma)
  const [activeEmployeeId, setActiveEmployeeId] = React.useState<string>('st-1');

  // Live Digital Clock
  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);

  // Data States
  const [staffList, setStaffList] = React.useState<StaffMemberDetail[]>([]);
  const [shiftTemplates, setShiftTemplates] = React.useState<ShiftTemplateDetail[]>([]);
  const [rosterSchedule, setRosterSchedule] = React.useState<StaffRosterDetail[]>([]);
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecordDetail[]>([]);
  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequestDetail[]>([]);
  const [dashboardSummary, setDashboardSummary] = React.useState<StaffDashboardSummary | null>(null);
  const [managerOverview, setManagerOverview] = React.useState<StaffManagerOverview | null>(null);
  const [leaveBalance, setLeaveBalance] = React.useState<LeaveBalanceDetail | null>(null);

  const [isOnboardModalOpen, setIsOnboardModalOpen] = React.useState<boolean>(false);

  // Auto-open modal on quick action
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'new-staff') {
        setIsOnboardModalOpen(true);
      }

      const handleQuickAction = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.id === 'act-add-staff') {
          setIsOnboardModalOpen(true);
        }
      };
      window.addEventListener('hive:quick-action', handleQuickAction);
      return () => window.removeEventListener('hive:quick-action', handleQuickAction);
    }
  }, []);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = React.useState<boolean>(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = React.useState<StaffMemberDetail | null>(null);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = React.useState<boolean>(false);
  const [isReviewLeaveModalOpen, setIsReviewLeaveModalOpen] = React.useState<boolean>(false);
  const [selectedLeaveForReview, setSelectedLeaveForReview] = React.useState<LeaveRequestDetail | null>(null);
  const [isShiftTemplateModalOpen, setIsShiftTemplateModalOpen] = React.useState<boolean>(false);
  const [isAssignShiftModalOpen, setIsAssignShiftModalOpen] = React.useState<boolean>(false);
  const [selectedRosterCell, setSelectedRosterCell] = React.useState<{ staffId: string; staffName: string; date: string; dayOfWeek: string } | null>(null);
  const [isManualAttendanceModalOpen, setIsManualAttendanceModalOpen] = React.useState<boolean>(false);

  // Form States
  const [onboardForm, setOnboardForm] = React.useState({
    employeeCode: 'EMP-HYD-009',
    displayName: '',
    jobTitle: 'Senior Stylist & Colorist',
    staffType: 'STYLIST' as StaffRoleType,
    phone: '+91 98765 00111',
    email: '',
    primaryBranchId: 'br-jubilee',
    joiningDate: new Date().toISOString().split('T')[0],
    skills: 'Balayage, Keratin, Precision Cut',
    commissionType: 'PERCENTAGE' as const,
    commissionRate: 15,
    monthlyRevenueTarget: 150000,
    monthlyServiceTarget: 70,
    isAvailableForBooking: true,
  });

  const [leaveApplyForm, setLeaveApplyForm] = React.useState({
    leaveType: 'CASUAL_LEAVE' as LeaveType,
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    isHalfDay: false,
    reason: '',
  });

  const [leaveReviewForm, setLeaveReviewForm] = React.useState({
    action: 'APPROVE' as 'APPROVE' | 'REJECT',
    reviewNotes: '',
  });

  const [shiftTemplateForm, setShiftTemplateForm] = React.useState({
    name: '',
    code: '',
    startTime: '09:00',
    endTime: '18:00',
    breakDurationMinutes: 60,
    color: '#d97706',
  });

  const [assignShiftForm, setAssignShiftForm] = React.useState({
    shiftTemplateId: 'shift-morn',
    isOffDay: false,
    notes: '',
  });

  const [manualAttendanceForm, setManualAttendanceForm] = React.useState({
    staffId: 'st-1',
    branchId: 'br-jubilee',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT' as AttendanceStatus,
    checkInTime: '09:00',
    checkOutTime: '18:00',
    notes: 'Approved manager override',
  });

  // Clock Ticker Effect
  React.useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data on Load
  const fetchAllData = React.useCallback(async () => {
    try {
      const branchParam = selectedBranch !== 'ALL' ? `?branchId=${selectedBranch}` : '';

      // 1. Staff List
      const staffRes = await fetch(`/api/v1/staff${branchParam}`);
      if (staffRes.ok) {
        const json = await staffRes.json();
        setStaffList(json.data || []);
      }

      // 2. Shift Templates
      const shiftRes = await fetch('/api/v1/staff/shifts/templates');
      if (shiftRes.ok) {
        const json = await shiftRes.json();
        setShiftTemplates(json.data || []);
      }

      // 3. Roster Schedule
      const rosterRes = await fetch(`/api/v1/staff/roster${branchParam}`);
      if (rosterRes.ok) {
        const json = await rosterRes.json();
        setRosterSchedule(json.data || []);
      }

      // 4. Attendance
      const attRes = await fetch(`/api/v1/staff/attendance${branchParam}`);
      if (attRes.ok) {
        const json = await attRes.json();
        setAttendanceRecords(json.data || []);
      }

      // 5. Leaves
      const leaveRes = await fetch(`/api/v1/staff/leaves${branchParam}`);
      if (leaveRes.ok) {
        const json = await leaveRes.json();
        setLeaveRequests(json.data || []);
      }

      // 6. Manager Overview
      const mgrRes = await fetch(`/api/v1/staff/manager/overview${branchParam}`);
      if (mgrRes.ok) {
        const json = await mgrRes.json();
        setManagerOverview(json.data || null);
      }

      // 7. Employee Dashboard Summary (for active employee)
      const dashRes = await fetch(`/api/v1/staff/dashboard/summary?staffId=${activeEmployeeId}`);
      if (dashRes.ok) {
        const json = await dashRes.json();
        setDashboardSummary(json.data || null);
      }

      // 8. Leave balance
      const balRes = await fetch(`/api/v1/staff/leaves/balance/${activeEmployeeId}`);
      if (balRes.ok) {
        const json = await balRes.json();
        setLeaveBalance(json.data || null);
      }
    } catch (err) {
      console.error('Failed to fetch staff data:', err);
    }
  }, [selectedBranch, activeEmployeeId]);

  React.useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 1-Click Check In / Punch Action
  const handleAttendancePunch = async (action: 'CHECK_IN' | 'CHECK_OUT' | 'START_BREAK' | 'END_BREAK') => {
    try {
      const activeStaff = staffList.find((s) => s.id === activeEmployeeId) || staffList[0];
      const res = await fetch('/api/v1/staff/attendance/punch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: activeStaff ? activeStaff.id : activeEmployeeId,
          branchId: activeStaff?.primaryBranchId || 'br-jubilee',
          action,
          method: 'WEB_PORTAL',
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Attendance Recorded',
          json.message || `Successfully processed ${action}.`
        );
        fetchAllData();
      } else {
        toast.error('Punch Error', json.message || 'Failed to record attendance punch.');
      }
    } catch (err) {
      toast.error('Network Error', 'Unable to connect to attendance engine.');
    }
  };

  // Submit Leave Application
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activeStaff = staffList.find((s) => s.id === activeEmployeeId) || staffList[0];
      const res = await fetch('/api/v1/staff/leaves/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: activeStaff?.id || activeEmployeeId,
          branchId: activeStaff?.primaryBranchId || 'br-jubilee',
          leaveType: leaveApplyForm.leaveType,
          startDate: leaveApplyForm.startDate,
          endDate: leaveApplyForm.endDate,
          isHalfDay: leaveApplyForm.isHalfDay,
          reason: leaveApplyForm.reason || 'Personal leave request.',
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Leave Submitted',
          'Your leave application has been routed to the branch manager.'
        );
        setIsApplyLeaveModalOpen(false);
        fetchAllData();
      } else {
        toast.error('Leave Failed', json.message || 'Could not submit leave application.');
      }
    } catch (err) {
      toast.error('Error', 'Failed to submit leave request.');
    }
  };

  // Review Leave Request
  const handleReviewLeave = async () => {
    if (!selectedLeaveForReview) return;
    try {
      const res = await fetch(`/api/v1/staff/leaves/${selectedLeaveForReview.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: leaveReviewForm.action,
          reviewNotes: leaveReviewForm.reviewNotes || `${leaveReviewForm.action} by manager.`,
          reviewerName: 'Sarah Jenkins (Branch Manager)',
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Review Processed',
          json.message || `Leave request ${leaveReviewForm.action.toLowerCase()}ed.`
        );
        setIsReviewLeaveModalOpen(false);
        setSelectedLeaveForReview(null);
        fetchAllData();
      } else {
        toast.error('Review Error', json.message || 'Failed to update leave request.');
      }
    } catch (err) {
      toast.error('Network Error', 'Could not process leave review.');
    }
  };

  // Submit Onboard Staff
  const handleOnboardStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = onboardForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/v1/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeCode: onboardForm.employeeCode,
          displayName: onboardForm.displayName,
          jobTitle: onboardForm.jobTitle,
          staffType: onboardForm.staffType,
          phone: onboardForm.phone,
          email: onboardForm.email || `${onboardForm.employeeCode.toLowerCase()}@hivesalon.com`,
          primaryBranchId: onboardForm.primaryBranchId,
          joiningDate: onboardForm.joiningDate,
          skills: skillsArray,
          specialization: skillsArray,
          commissionType: onboardForm.commissionType,
          commissionRate: Number(onboardForm.commissionRate),
          monthlyRevenueTarget: Number(onboardForm.monthlyRevenueTarget),
          monthlyServiceTarget: Number(onboardForm.monthlyServiceTarget),
          isAvailableForBooking: onboardForm.isAvailableForBooking,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Staff Onboarded',
          `Employee "${json.data.displayName}" (${json.data.employeeCode}) onboarded successfully.`
        );
        setIsOnboardModalOpen(false);
        setOnboardForm({
          employeeCode: `EMP-HYD-0${staffList.length + 10}`,
          displayName: '',
          jobTitle: 'Senior Stylist & Colorist',
          staffType: 'STYLIST',
          phone: '+91 98765 00111',
          email: '',
          primaryBranchId: 'br-jubilee',
          joiningDate: new Date().toISOString().split('T')[0],
          skills: 'Balayage, Keratin, Precision Cut',
          commissionType: 'PERCENTAGE',
          commissionRate: 15,
          monthlyRevenueTarget: 150000,
          monthlyServiceTarget: 70,
          isAvailableForBooking: true,
        });
        fetchAllData();
      } else {
        toast.error('Onboarding Failed', json.message || 'Could not onboard staff profile.');
      }
    } catch (err) {
      toast.error('Error', 'Could not create staff record.');
    }
  };

  // Submit Shift Template
  const handleCreateShiftTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/staff/shifts/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: shiftTemplateForm.name,
          code: shiftTemplateForm.code.toUpperCase(),
          startTime: shiftTemplateForm.startTime,
          endTime: shiftTemplateForm.endTime,
          breakDurationMinutes: Number(shiftTemplateForm.breakDurationMinutes),
          color: shiftTemplateForm.color,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Shift Template Created',
          `Shift template "${json.data.name}" (${json.data.code}) is ready for rosters.`
        );
        setIsShiftTemplateModalOpen(false);
        setShiftTemplateForm({
          name: '',
          code: '',
          startTime: '09:00',
          endTime: '18:00',
          breakDurationMinutes: 60,
          color: '#d97706',
        });
        fetchAllData();
      } else {
        toast.error('Template Error', json.message || 'Failed to create shift template.');
      }
    } catch (err) {
      toast.error('Error', 'Could not save shift template.');
    }
  };

  // Submit Roster Assignment
  const handleAssignRoster = async () => {
    if (!selectedRosterCell) return;
    try {
      const res = await fetch('/api/v1/staff/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: selectedRosterCell.staffId,
          branchId: selectedBranch !== 'ALL' ? selectedBranch : 'br-jubilee',
          date: selectedRosterCell.date,
          shiftTemplateId: assignShiftForm.isOffDay ? undefined : assignShiftForm.shiftTemplateId,
          isOffDay: assignShiftForm.isOffDay,
          notes: assignShiftForm.notes,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Roster Updated',
          `Shift assigned to ${selectedRosterCell.staffName} for ${selectedRosterCell.date}.`
        );
        setIsAssignShiftModalOpen(false);
        setSelectedRosterCell(null);
        fetchAllData();
      } else {
        toast.error('Roster Error', json.message || 'Could not assign shift.');
      }
    } catch (err) {
      toast.error('Error', 'Failed to update roster.');
    }
  };

  // Submit Manual Attendance Override
  const handleManualAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/staff/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: manualAttendanceForm.staffId,
          branchId: manualAttendanceForm.branchId,
          date: manualAttendanceForm.date,
          status: manualAttendanceForm.status,
          checkInTime: `${manualAttendanceForm.date}T${manualAttendanceForm.checkInTime}:00.000Z`,
          checkOutTime: `${manualAttendanceForm.date}T${manualAttendanceForm.checkOutTime}:00.000Z`,
          notes: manualAttendanceForm.notes,
          performedByName: 'Sarah Jenkins (Branch Manager)',
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success('Attendance Adjusted', 'Manual attendance override record committed.');
        setIsManualAttendanceModalOpen(false);
        fetchAllData();
      } else {
        toast.error('Override Failed', json.message || 'Could not record manual attendance.');
      }
    } catch (err) {
      toast.error('Error', 'Failed to record manual attendance.');
    }
  };

  // Filtered Staff Directory
  const filteredStaff = React.useMemo(() => {
    return staffList.filter((s) => {
      const matchesSearch =
        s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = selectedRoleFilter === 'ALL' || s.staffType === selectedRoleFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || s.status === selectedStatusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffList, searchQuery, selectedRoleFilter, selectedStatusFilter]);

  // Current active staff object for portal view
  const currentActiveStaff = React.useMemo(() => {
    return staffList.find((s) => s.id === activeEmployeeId) || staffList[0] || null;
  }, [staffList, activeEmployeeId]);

  // Weekly Dates for Roster (Mon to Sun)
  const rosterDays = React.useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sun, 1 is Mon
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);

    const days = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === today.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayName: dayNames[i],
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday,
      });
    }
    return days;
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP HEADER & PERSONA / MODE SWITCHER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Phase 9 Workforce Engine
              </span>
              <span className="text-xs text-slate-400">
                10 Specialized Roles • 1-Click Biometric Punch • Weekly Shift Rostering
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-amber-400" />
              Staff Management &amp; Employee Portal
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Unified salon human capital platform. Stylists punch attendance, view appointment queues, track revenue targets, and apply leaves; managers orchestrate shift matrices and approvals.
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('PORTAL')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'PORTAL'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scissors className="w-4 h-4" />
                Employee Self-Service
              </button>
              <button
                type="button"
                onClick={() => setViewMode('MANAGER')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'MANAGER'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Manager Admin Hub
              </button>
            </div>

            {/* In Portal Mode: Allow switching persona */}
            {viewMode === 'PORTAL' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Active Persona:</span>
                <select
                  value={activeEmployeeId}
                  onChange={(e) => setActiveEmployeeId(e.target.value)}
                  className="text-xs bg-slate-900 border border-amber-500/40 text-amber-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.displayName} ({st.staffType})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: EMPLOYEE SELF-SERVICE PORTAL                                      */}
      {/* ========================================================================= */}
      {viewMode === 'PORTAL' && dashboardSummary && (
        <div className="space-y-6">
          {/* 1.1 HERO ATTENDANCE & DIGITAL CLOCK PUNCH CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Giant Punch Action Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl font-bold text-amber-400">
                    {currentActiveStaff?.displayName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      {currentActiveStaff?.displayName}
                      <Badge variant="default">
                        {currentActiveStaff?.staffType}
                      </Badge>
                    </h2>
                    <p className="text-xs text-slate-400">
                      ID: <span className="font-mono text-amber-300">{currentActiveStaff?.employeeCode}</span> • {currentActiveStaff?.jobTitle} • {currentActiveStaff?.primaryBranchName}
                    </p>
                  </div>
                </div>

                {/* Shift Details Pill */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">Shift:</span>
                  <span className="font-semibold text-slate-200">
                    {dashboardSummary.todayAttendance.shiftName} ({dashboardSummary.todayAttendance.shiftTiming})
                  </span>
                </div>
              </div>

              {/* Central Clock & Punch Action */}
              <div className="my-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Live Attendance Terminal • {currentTime?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-amber-400 drop-shadow-sm">
                    {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '11:58:30 AM'}
                  </div>

                  {/* Status Banner */}
                  <div className="mt-3 flex items-center gap-2">
                    {dashboardSummary.todayAttendance.isCheckedIn ? (
                      <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Checked in at{' '}
                        {dashboardSummary.todayAttendance.checkInTime
                          ? new Date(dashboardSummary.todayAttendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '09:00 AM'}{' '}
                        • {dashboardSummary.todayAttendance.isOnBreak ? '☕ On Break' : '🟢 Ready for Booking'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        Not Checked In Yet • Standard Roster Starts 09:00 AM
                      </div>
                    )}
                  </div>
                </div>

                {/* Big 1-Click Interactive Punch Action */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {!dashboardSummary.todayAttendance.isCheckedIn ? (
                    <button
                      type="button"
                      onClick={() => handleAttendancePunch('CHECK_IN')}
                      className="group relative px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base tracking-wide shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 flex items-center gap-3 cursor-pointer"
                    >
                      <LogIn className="w-6 h-6 text-slate-950" />
                      <span>CHECK IN NOW</span>
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {!dashboardSummary.todayAttendance.isOnBreak ? (
                        <Button
                          variant="secondary"
                          onClick={() => handleAttendancePunch('START_BREAK')}
                          className="flex items-center gap-2"
                        >
                          <Coffee className="w-4 h-4 text-amber-400" />
                          Start Break (60m)
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => handleAttendancePunch('END_BREAK')}
                          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500"
                        >
                          <Coffee className="w-4 h-4" />
                          Resume Duty (End Break)
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => handleAttendancePunch('CHECK_OUT')}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Check Out
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Micro-info */}
              <div className="border-t border-slate-800/80 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>
                    ⏱️ Total Logged Today:{' '}
                    <strong className="text-slate-200">
                      {dashboardSummary.todayAttendance.totalHoursWorkedToday} hrs
                    </strong>
                  </span>
                  <span>
                    🏢 Biometric Terminal ID:{' '}
                    <strong className="font-mono text-slate-300">BIO-JUB-01</strong>
                  </span>
                </div>
                <div className="text-amber-400 font-medium">
                  {dashboardSummary.todayAttendance.isCheckedIn
                    ? '✨ Auto-commission calculation active on all invoices'
                    : '👉 Tap CHECK IN to start receiving walk-in clients'}
                </div>
              </div>
            </div>

            {/* Quick Balance & Target Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Monthly Sales Target
                  </h3>
                  <Badge variant="default">
                    #{dashboardSummary.performance.rankInBranch} of {dashboardSummary.performance.totalStaffInBranch} in Branch
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Month-to-Date Revenue</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(dashboardSummary.performance.monthToDateRevenue)} / {formatCurrency(dashboardSummary.performance.monthlyRevenueTarget)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${dashboardSummary.performance.targetProgressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>{dashboardSummary.performance.targetProgressPercentage}% Achieved</span>
                      <span>Target: {formatCurrency(dashboardSummary.performance.monthlyRevenueTarget)}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Commission Rate:</span>
                      <strong className="text-amber-400">{currentActiveStaff?.commissionRate || 15}%</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Accrued Commission:</span>
                      <strong className="text-emerald-400 text-sm font-bold">
                        {formatCurrency(dashboardSummary.performance.monthToDateCommission)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Application Shortcut */}
              <div className="border-t border-slate-800 pt-4 mt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Available Leaves:</div>
                  <div className="text-sm font-bold text-slate-200">
                    {leaveBalance?.totalAvailable || 35} Days Remaining
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsApplyLeaveModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Apply Leave
                </Button>
              </div>
            </div>
          </div>

          {/* 1.2 TODAY APPOINTMENTS QUEUE & METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assigned Appointments List */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-amber-400" />
                    Today Assigned Appointments ({dashboardSummary.todayAppointments.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live chair allocations and client formulation notes
                  </p>
                </div>
                <Badge variant="secondary">
                  {dashboardSummary.upcomingAppointmentsCount} Upcoming this Week
                </Badge>
              </div>

              <div className="space-y-3">
                {dashboardSummary.todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          {apt.startTime} – {apt.endTime}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{apt.chairNumber}</span>
                        <Badge
                          variant={apt.status === 'IN_SERVICE' ? 'default' : 'secondary'}
                        >
                          {apt.status === 'IN_SERVICE' ? '💇 In Service Now' : 'Confirmed'}
                        </Badge>
                      </div>
                      <div className="text-sm font-bold text-white">{apt.customerName}</div>
                      <div className="text-xs text-slate-300 font-medium">{apt.serviceName}</div>
                      {apt.clientNotes && (
                        <div className="text-[11px] text-amber-300/80 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20 max-w-md">
                          📝 {apt.clientNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Bill Value</div>
                        <div className="text-sm font-bold text-emerald-400">{formatCurrency(apt.price)}</div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          toast.info(
                            'Appointment Flow',
                            `Opening service station console for ${apt.customerName}.`
                          )
                        }
                        className="text-xs"
                      >
                        Station View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Balance Breakdown & Recent Attendance Log */}
            <div className="space-y-6">
              {/* Leave Breakdown Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Leave Balances ({new Date().getFullYear()})
                </h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400">Casual (CL)</div>
                    <div className="text-lg font-bold text-amber-400">
                      {leaveBalance?.casualLeave.available || 8}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      of {leaveBalance?.casualLeave.total || 12} days
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400">Sick (SL)</div>
                    <div className="text-lg font-bold text-blue-400">
                      {leaveBalance?.sickLeave.available || 7}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      of {leaveBalance?.sickLeave.total || 8} days
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400">Earned (EL)</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {leaveBalance?.earnedLeave.available || 14}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      of {leaveBalance?.earnedLeave.total || 15} days
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsApplyLeaveModalOpen(true)}
                  >
                    Apply for New Leave
                  </Button>
                </div>
              </div>

              {/* Recent Punches */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-amber-400" />
                  Recent Attendance Logs
                </h3>
                <div className="space-y-2">
                  {dashboardSummary.recentAttendanceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{log.date}</span>
                        <div className="text-[11px] text-slate-400">
                          {log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM'}
                          {' → '}
                          {log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:00 PM'}
                        </div>
                      </div>
                      <Badge
                        variant={log.status === 'PRESENT' || log.status === 'OVERTIME' ? 'success' : log.status === 'LATE' ? 'warning' : 'secondary'}
                      >
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MANAGER ADMINISTRATION HUB                                        */}
      {/* ========================================================================= */}
      {viewMode === 'MANAGER' && (
        <div className="space-y-6">
          {/* 2.1 MANAGER OVERVIEW KPIS */}
          {managerOverview && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Total Staff</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{managerOverview.totalStaffCount}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Across 10 salon roles</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Present Today</span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">{managerOverview.presentTodayCount}</div>
                <div className="text-[11px] text-emerald-500/80 mt-0.5">Active on salon floor</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>In Service</span>
                  <Scissors className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">{managerOverview.inServiceCount}</div>
                <div className="text-[11px] text-blue-500/80 mt-0.5">Styling clients right now</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>On Break</span>
                  <Coffee className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400">{managerOverview.onBreakCount}</div>
                <div className="text-[11px] text-amber-500/80 mt-0.5">Staff break room</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Late Today</span>
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-rose-400">{managerOverview.lateTodayCount}</div>
                <div className="text-[11px] text-rose-500/80 mt-0.5">&gt; 15m grace threshold</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Pending Leaves</span>
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-400">{managerOverview.pendingLeaveRequestsCount}</div>
                <div className="text-[11px] text-purple-500/80 mt-0.5">Awaiting manager review</div>
              </div>
            </div>
          )}

          {/* 2.2 MANAGER TABS NAVIGATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'overview', label: 'Staff Directory (10 Roles)', icon: Users },
                  { id: 'roster', label: 'Weekly Shift Rosters', icon: Calendar },
                  { id: 'attendance', label: 'Attendance & Biometrics', icon: Fingerprint },
                  { id: 'leaves', label: 'Leave Approvals', icon: FileText, count: managerOverview?.pendingLeaveRequestsCount },
                  { id: 'commission', label: 'Commission Leaderboard', icon: TrendingUp },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setManagerTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        managerTab === tab.id
                          ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  options={branchOptions}
                  className="w-56 text-xs"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsOnboardModalOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Onboard Staff
                </Button>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: STAFF DIRECTORY (10 ROLES)                                     */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'overview' && (
              <div className="space-y-4">
                {/* Filter Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search staff name, code, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="ALL">All Staff Roles (10 Roles)</option>
                    {staffRoleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.icon} {opt.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active Staff</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive / Resigned</option>
                  </select>
                </div>

                {/* Staff Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {filteredStaff.map((st) => (
                    <div
                      key={st.id}
                      className="bg-slate-950 border border-slate-800/90 rounded-xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                              {st.displayName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{st.displayName}</h4>
                              <p className="text-[11px] text-slate-400">
                                <span className="font-mono text-amber-400">{st.employeeCode}</span> • {st.primaryBranchName}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={staffRoleBadges[st.staffType]?.variant || 'default'}
                          >
                            {staffRoleBadges[st.staffType]?.label || st.staffType}
                          </Badge>
                        </div>

                        {/* Skills pills */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {st.skills.map((sk) => (
                            <span
                              key={sk}
                              className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>

                        {/* Target & Commission stats */}
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target Progress:</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(st.achievedMonthlyRevenue || 0)} / {formatCurrency(st.monthlyRevenueTarget)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full"
                              style={{
                                width: `${
                                  st.monthlyRevenueTarget > 0
                                    ? Math.min(100, Math.round(((st.achievedMonthlyRevenue || 0) / st.monthlyRevenueTarget) * 100))
                                    : 100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800">
                            <span className="text-slate-400">Commission Plan:</span>
                            <span className="text-emerald-400 font-medium">
                              {st.commissionRate}% of Net Services
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs">
                        <span className="text-slate-400">
                          Joined: <strong className="text-slate-300">{st.joiningDate}</strong>
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedStaffForEdit(st);
                            setIsEditStaffModalOpen(true);
                          }}
                          className="text-xs"
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: WEEKLY SHIFT ROSTER SCHEDULER                                 */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'roster' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Weekly Shift Schedule (Monday – Sunday)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Click any cell to assign custom shift templates or assign weekly offs
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsShiftTemplateModalOpen(true)}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      Shift Templates ({shiftTemplates.length})
                    </Button>
                  </div>
                </div>

                {/* Shift Roster Matrix Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800">
                        <th className="p-3 text-slate-400 font-semibold sticky left-0 bg-slate-950 min-w-[180px]">
                          Staff Member
                        </th>
                        {rosterDays.map((day) => (
                          <th
                            key={day.dateStr}
                            className={`p-3 font-semibold text-center min-w-[130px] ${
                              day.isToday ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300'
                            }`}
                          >
                            <div>{day.dayName}</div>
                            <div className="text-[10px] text-slate-500 font-normal">{day.formatted}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                      {staffList.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 sticky left-0 bg-slate-950 font-medium text-white border-r border-slate-800">
                            <div>{st.displayName}</div>
                            <div className="text-[10px] text-slate-400">
                              <span className="font-mono text-amber-400">{st.employeeCode}</span> • {st.staffType}
                            </div>
                          </td>

                          {rosterDays.map((day) => {
                            const assignedRoster = rosterSchedule.find(
                              (r) => r.staffId === st.id && r.date === day.dateStr
                            );
                            const isOff = assignedRoster?.isOffDay;
                            const shiftCode = assignedRoster?.shiftCode || 'MORN';

                            return (
                              <td
                                key={day.dateStr}
                                className={`p-2 text-center border-r border-slate-800/60 ${
                                  day.isToday ? 'bg-amber-500/5' : ''
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRosterCell({
                                      staffId: st.id,
                                      staffName: st.displayName,
                                      date: day.dateStr,
                                      dayOfWeek: day.dayName,
                                    });
                                    setAssignShiftForm({
                                      shiftTemplateId: assignedRoster?.shiftTemplateId || 'shift-morn',
                                      isOffDay: !!assignedRoster?.isOffDay,
                                      notes: assignedRoster?.notes || '',
                                    });
                                    setIsAssignShiftModalOpen(true);
                                  }}
                                  className={`w-full py-2 px-2 rounded-lg border text-[11px] font-semibold transition-all hover:scale-105 ${
                                    isOff
                                      ? 'bg-slate-800/60 border-slate-700 text-slate-400'
                                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                  }`}
                                >
                                  {isOff ? (
                                    '🌴 Weekly Off'
                                  ) : (
                                    <div>
                                      <div className="font-bold">{shiftCode}</div>
                                      <div className="text-[10px] text-slate-400">
                                        {assignedRoster?.startTime || '09:00'} - {assignedRoster?.endTime || '18:00'}
                                      </div>
                                    </div>
                                  )}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: ATTENDANCE & BIOMETRICS                                        */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'attendance' && (
              <div className="space-y-4">
                {/* Biometric Integration Status Panel */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        Biometric Hardware Gateway
                        <Badge variant="success">
                          Online &amp; Connected
                        </Badge>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Device: <span className="font-mono text-slate-300">ZKTeco BioStation Pro (HYD-JUB-01)</span> • IP: 192.168.1.140 • Last Sync: 2 mins ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsManualAttendanceModalOpen(true)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      Manual Override Punch
                    </Button>
                  </div>
                </div>

                {/* Attendance Log Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <th className="p-3 font-semibold">Staff Member</th>
                        <th className="p-3 font-semibold">Role</th>
                        <th className="p-3 font-semibold">Check-In</th>
                        <th className="p-3 font-semibold">Check-Out</th>
                        <th className="p-3 font-semibold">Total Hours</th>
                        <th className="p-3 font-semibold">Method</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                      {attendanceRecords.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-medium text-white">
                            <div>{att.staffName}</div>
                            <div className="text-[10px] font-mono text-amber-400">{att.staffCode}</div>
                          </td>
                          <td className="p-3 text-slate-300">{att.staffType}</td>
                          <td className="p-3 text-slate-200 font-mono">
                            {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td className="p-3 text-slate-200 font-mono">
                            {att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td className="p-3 text-slate-300 font-semibold">
                            {att.totalWorkingHours ? `${att.totalWorkingHours} hrs` : 'In Progress'}
                          </td>
                          <td className="p-3 text-slate-400">
                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono">
                              {att.checkInMethod}
                            </span>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={attendanceStatusBadges[att.status]?.variant || 'default'}
                            >
                              {attendanceStatusBadges[att.status]?.label || att.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: LEAVE APPROVALS INBOX                                          */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'leaves' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      Employee Leave Applications &amp; Balances
                    </h3>
                    <p className="text-xs text-slate-400">
                      Review pending leave applications and approve/reject with automated ledger balance deduction
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <th className="p-3 font-semibold">Employee</th>
                        <th className="p-3 font-semibold">Leave Type</th>
                        <th className="p-3 font-semibold">Duration</th>
                        <th className="p-3 font-semibold">Total Days</th>
                        <th className="p-3 font-semibold">Reason</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                      {leaveRequests.map((leave) => (
                        <tr key={leave.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-medium text-white">
                            <div>{leave.staffName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{leave.staffCode}</div>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={leaveTypeBadges[leave.leaveType]?.variant || 'default'}
                            >
                              {leaveTypeBadges[leave.leaveType]?.label || leave.leaveType}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-300">
                            {leave.startDate} → {leave.endDate}
                          </td>
                          <td className="p-3 font-semibold text-white">
                            {leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'}
                            {leave.isHalfDay && ' (Half Day)'}
                          </td>
                          <td className="p-3 text-slate-300 max-w-xs truncate" title={leave.reason}>
                            {leave.reason}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                leave.status === 'APPROVED'
                                  ? 'success'
                                  : leave.status === 'REJECTED'
                                    ? 'destructive'
                                    : 'warning'
                              }
                            >
                              {leave.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            {leave.status === 'PENDING' ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedLeaveForReview(leave);
                                  setLeaveReviewForm({ action: 'APPROVE', reviewNotes: 'Approved by manager.' });
                                  setIsReviewLeaveModalOpen(true);
                                }}
                                className="text-xs"
                              >
                                Review Request
                              </Button>
                            ) : (
                              <span className="text-[11px] text-slate-500">
                                Reviewed by {leave.reviewedByName?.split(' ')[0] || 'Manager'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 5: COMMISSION & PERFORMANCE LEADERBOARD                           */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'commission' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Branch Commission &amp; Revenue Leaderboard
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time revenue achievement, service volume, and accrued commissions
                    </p>
                  </div>
                  <Badge variant="default">
                    Live Calculation
                  </Badge>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <th className="p-3 font-semibold">Rank &amp; Stylist</th>
                        <th className="p-3 font-semibold">Role</th>
                        <th className="p-3 font-semibold">Branch</th>
                        <th className="p-3 font-semibold">Revenue This Month</th>
                        <th className="p-3 font-semibold">Services Completed</th>
                        <th className="p-3 font-semibold">Target Achievement</th>
                        <th className="p-3 font-semibold text-right">Commission Accrued</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                      {managerOverview?.topPerformingStaff?.map((performer, idx) => (
                        <tr key={performer.staffId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-medium text-white flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                idx === 0
                                  ? 'bg-amber-400 text-slate-950'
                                  : idx === 1
                                    ? 'bg-slate-300 text-slate-950'
                                    : idx === 2
                                      ? 'bg-amber-700 text-white'
                                      : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-bold">{performer.staffName}</div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-300">{performer.staffType}</td>
                          <td className="p-3 text-slate-400">{performer.branchName}</td>
                          <td className="p-3 font-bold text-white">
                            {formatCurrency(performer.revenueThisMonth)}
                          </td>
                          <td className="p-3 text-slate-300">{performer.servicesCompleted} services</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-400 h-full rounded-full"
                                  style={{ width: `${Math.min(100, performer.targetAchievementPercentage)}%` }}
                                />
                              </div>
                              <span className="font-bold text-emerald-400">
                                {performer.targetAchievementPercentage}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-400 text-sm">
                            {formatCurrency(performer.commissionEarned)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ONBOARD NEW STAFF PROFILE                                        */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        title="Onboard New Salon Staff Member"
        description="Register a new employee across any of the 10 specialized salon roles with commission plans and branch allocations."
        maxWidth="2xl"
      >
        <form onSubmit={handleOnboardStaff} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Employee ID / Code *</label>
              <Input
                value={onboardForm.employeeCode}
                onChange={(e) => setOnboardForm({ ...onboardForm, employeeCode: e.target.value })}
                placeholder="EMP-HYD-009"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Display Name *</label>
              <Input
                value={onboardForm.displayName}
                onChange={(e) => setOnboardForm({ ...onboardForm, displayName: e.target.value })}
                placeholder="e.g. Meera Nambiar"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Specialized Staff Role *</label>
              <select
                value={onboardForm.staffType}
                onChange={(e) => setOnboardForm({ ...onboardForm, staffType: e.target.value as StaffRoleType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {staffRoleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
              <Input
                value={onboardForm.jobTitle}
                onChange={(e) => setOnboardForm({ ...onboardForm, jobTitle: e.target.value })}
                placeholder="e.g. Senior Nail Artist & Gel Specialist"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mobile Phone *</label>
              <Input
                value={onboardForm.phone}
                onChange={(e) => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
              <Input
                value={onboardForm.email}
                onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                placeholder="employee@hivesalon.com"
                type="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Branch *</label>
              <select
                value={onboardForm.primaryBranchId}
                onChange={(e) => setOnboardForm({ ...onboardForm, primaryBranchId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="br-jubilee">Jubilee Hills Flagship (HYD)</option>
                <option value="br-banjara">Banjara Hills Spa &amp; Lounge (HYD)</option>
                <option value="br-hitech">Hitech City Express (HYD)</option>
                <option value="br-indiranagar">Indiranagar Sanctuary (BLR)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Joining Date</label>
              <Input
                type="date"
                value={onboardForm.joiningDate}
                onChange={(e) => setOnboardForm({ ...onboardForm, joiningDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Skills &amp; Formulations (Comma Separated)</label>
            <Input
              value={onboardForm.skills}
              onChange={(e) => setOnboardForm({ ...onboardForm, skills: e.target.value })}
              placeholder="Balayage, Keratin, Precision Cut, Gel Extensions"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Commission Rate (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={onboardForm.commissionRate}
                onChange={(e) => setOnboardForm({ ...onboardForm, commissionRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Monthly Revenue Target (₹)</label>
              <Input
                type="number"
                value={onboardForm.monthlyRevenueTarget}
                onChange={(e) => setOnboardForm({ ...onboardForm, monthlyRevenueTarget: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Monthly Service Count</label>
              <Input
                type="number"
                value={onboardForm.monthlyServiceTarget}
                onChange={(e) => setOnboardForm({ ...onboardForm, monthlyServiceTarget: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsOnboardModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Complete Onboarding
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: APPLY FOR LEAVE                                                  */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isApplyLeaveModalOpen}
        onClose={() => setIsApplyLeaveModalOpen(false)}
        title="Apply for Employee Leave"
        description="Submit a leave request for manager approval. Balances will be updated upon approval."
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Leave Type *</label>
            <select
              value={leaveApplyForm.leaveType}
              onChange={(e) => setLeaveApplyForm({ ...leaveApplyForm, leaveType: e.target.value as LeaveType })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="CASUAL_LEAVE">Casual Leave (CL) — {leaveBalance?.casualLeave.available || 8} days available</option>
              <option value="SICK_LEAVE">Sick Leave (SL) — {leaveBalance?.sickLeave.available || 7} days available</option>
              <option value="EARNED_LEAVE">Earned / Privilege Leave (EL) — {leaveBalance?.earnedLeave.available || 14} days available</option>
              <option value="UNPAID_LEAVE">Unpaid Leave (LOP)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Start Date *</label>
              <Input
                type="date"
                value={leaveApplyForm.startDate}
                onChange={(e) => setLeaveApplyForm({ ...leaveApplyForm, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">End Date *</label>
              <Input
                type="date"
                value={leaveApplyForm.endDate}
                onChange={(e) => setLeaveApplyForm({ ...leaveApplyForm, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="halfDay"
              checked={leaveApplyForm.isHalfDay}
              onChange={(e) => setLeaveApplyForm({ ...leaveApplyForm, isHalfDay: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-amber-500"
            />
            <label htmlFor="halfDay" className="text-slate-300 font-medium cursor-pointer">
              Half-day leave (0.5 day deduction)
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reason for Leave *</label>
            <textarea
              value={leaveApplyForm.reason}
              onChange={(e) => setLeaveApplyForm({ ...leaveApplyForm, reason: e.target.value })}
              rows={3}
              placeholder="e.g. Attending family wedding / Doctor appointment"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsApplyLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: REVIEW LEAVE REQUEST (MANAGER)                                  */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isReviewLeaveModalOpen}
        onClose={() => setIsReviewLeaveModalOpen(false)}
        title="Review Leave Application"
        description={`Decision for ${selectedLeaveForReview?.staffName} (${selectedLeaveForReview?.totalDays} days ${selectedLeaveForReview?.leaveType})`}
      >
        <div className="space-y-4 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Employee:</span>
              <strong className="text-white">{selectedLeaveForReview?.staffName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date Range:</span>
              <span className="text-amber-400 font-semibold">
                {selectedLeaveForReview?.startDate} to {selectedLeaveForReview?.endDate} ({selectedLeaveForReview?.totalDays} days)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reason:</span>
              <span className="text-slate-200">{selectedLeaveForReview?.reason}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Decision *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaveReviewForm({ ...leaveReviewForm, action: 'APPROVE' })}
                className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                  leaveReviewForm.action === 'APPROVE'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ✓ Approve Leave
              </button>
              <button
                type="button"
                onClick={() => setLeaveReviewForm({ ...leaveReviewForm, action: 'REJECT' })}
                className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                  leaveReviewForm.action === 'REJECT'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ✗ Reject Leave
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Manager Review Notes</label>
            <Input
              value={leaveReviewForm.reviewNotes}
              onChange={(e) => setLeaveReviewForm({ ...leaveReviewForm, reviewNotes: e.target.value })}
              placeholder="e.g. Approved. Shift covered by Ananya."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsReviewLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={leaveReviewForm.action === 'APPROVE' ? 'primary' : 'destructive'}
              onClick={handleReviewLeave}
            >
              Confirm {leaveReviewForm.action === 'APPROVE' ? 'Approval' : 'Rejection'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: ASSIGN SHIFT ROSTER CELL                                         */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAssignShiftModalOpen}
        onClose={() => setIsAssignShiftModalOpen(false)}
        title="Assign Roster Shift"
        description={`Update schedule for ${selectedRosterCell?.staffName} on ${selectedRosterCell?.dayOfWeek} (${selectedRosterCell?.date})`}
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isOffDay"
              checked={assignShiftForm.isOffDay}
              onChange={(e) => setAssignShiftForm({ ...assignShiftForm, isOffDay: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-amber-500"
            />
            <label htmlFor="isOffDay" className="text-slate-200 font-semibold cursor-pointer">
              Set as Weekly Off (No Working Shift)
            </label>
          </div>

          {!assignShiftForm.isOffDay && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Shift Template *</label>
              <select
                value={assignShiftForm.shiftTemplateId}
                onChange={(e) => setAssignShiftForm({ ...assignShiftForm, shiftTemplateId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {shiftTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code}: {t.startTime} – {t.endTime})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Shift Notes (Optional)</label>
            <Input
              value={assignShiftForm.notes}
              onChange={(e) => setAssignShiftForm({ ...assignShiftForm, notes: e.target.value })}
              placeholder="e.g. VIP Bridal booking coverage"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsAssignShiftModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAssignRoster}>
              Save Shift Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 5: CREATE SHIFT TEMPLATE                                            */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isShiftTemplateModalOpen}
        onClose={() => setIsShiftTemplateModalOpen(false)}
        title="Create New Shift Template"
        description="Define a reusable shift pattern with start/end hours and break durations."
      >
        <form onSubmit={handleCreateShiftTemplate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Shift Name *</label>
              <Input
                value={shiftTemplateForm.name}
                onChange={(e) => setShiftTemplateForm({ ...shiftTemplateForm, name: e.target.value })}
                placeholder="e.g. Night Party Rush"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Shift Code *</label>
              <Input
                value={shiftTemplateForm.code}
                onChange={(e) => setShiftTemplateForm({ ...shiftTemplateForm, code: e.target.value })}
                placeholder="NIGHT"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Start Time (24h) *</label>
              <Input
                type="time"
                value={shiftTemplateForm.startTime}
                onChange={(e) => setShiftTemplateForm({ ...shiftTemplateForm, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">End Time (24h) *</label>
              <Input
                type="time"
                value={shiftTemplateForm.endTime}
                onChange={(e) => setShiftTemplateForm({ ...shiftTemplateForm, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Break Duration (Mins)</label>
              <Input
                type="number"
                value={shiftTemplateForm.breakDurationMinutes}
                onChange={(e) => setShiftTemplateForm({ ...shiftTemplateForm, breakDurationMinutes: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Badge Color Code</label>
              <Input
                type="color"
                value={shiftTemplateForm.color}
                onChange={(e) => setShiftTemplateForm({ ...shiftTemplateForm, color: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsShiftTemplateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Shift Template
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 6: MANUAL ATTENDANCE OVERRIDE                                       */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isManualAttendanceModalOpen}
        onClose={() => setIsManualAttendanceModalOpen(false)}
        title="Manual Attendance Override"
        description="Manager punch adjustment for biometric sync exceptions or forgotten card punches."
      >
        <form onSubmit={handleManualAttendance} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Staff Member *</label>
            <select
              value={manualAttendanceForm.staffId}
              onChange={(e) => setManualAttendanceForm({ ...manualAttendanceForm, staffId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName} ({s.employeeCode} • {s.staffType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date *</label>
              <Input
                type="date"
                value={manualAttendanceForm.date}
                onChange={(e) => setManualAttendanceForm({ ...manualAttendanceForm, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Status Override *</label>
              <select
                value={manualAttendanceForm.status}
                onChange={(e) => setManualAttendanceForm({ ...manualAttendanceForm, status: e.target.value as AttendanceStatus })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="PRESENT">Present (On Time)</option>
                <option value="LATE">Late Arrival</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="OVERTIME">Overtime</option>
                <option value="ON_LEAVE">On Approved Leave</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Check-In Time</label>
              <Input
                type="time"
                value={manualAttendanceForm.checkInTime}
                onChange={(e) => setManualAttendanceForm({ ...manualAttendanceForm, checkInTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Check-Out Time</label>
              <Input
                type="time"
                value={manualAttendanceForm.checkOutTime}
                onChange={(e) => setManualAttendanceForm({ ...manualAttendanceForm, checkOutTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Override Reason Notes</label>
            <Input
              value={manualAttendanceForm.notes}
              onChange={(e) => setManualAttendanceForm({ ...manualAttendanceForm, notes: e.target.value })}
              placeholder="e.g. Biometric scanner power glitch at entrance gate"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsManualAttendanceModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Commit Attendance Override
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function StaffPage(props: StaffPageProps) {
  return <StaffView initialTab={props?.initialTab ?? 'overview'} initialMode={props?.initialMode ?? 'MANAGER'} />;
}

