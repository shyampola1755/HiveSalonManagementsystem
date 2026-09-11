/**
 * Phase 9: Staff Management, Attendance, Shifts & Employee Portal Types
 */

export type StaffRoleType =
  | 'STYLIST'
  | 'HAIRDRESSER'
  | 'BEAUTICIAN'
  | 'THERAPIST'
  | 'NAIL_ARTIST'
  | 'MAKEUP_ARTIST'
  | 'TATTOO_ARTIST'
  | 'FRONT_DESK'
  | 'MANAGER'
  | 'ACCOUNTANT';

export type StaffStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE' | 'TERMINATED';

export type CommissionType = 'PERCENTAGE' | 'FIXED' | 'TIERED';

export type AttendanceStatus =
  | 'PRESENT'
  | 'LATE'
  | 'HALF_DAY'
  | 'ABSENT'
  | 'ON_LEAVE'
  | 'OVERTIME';

export type CheckInMethod =
  | 'WEB_PORTAL'
  | 'MOBILE_GPS'
  | 'BIOMETRIC_DEVICE'
  | 'RFID_CARD'
  | 'MANUAL_MANAGER';

export type LeaveType =
  | 'CASUAL_LEAVE'
  | 'SICK_LEAVE'
  | 'EARNED_LEAVE'
  | 'MATERNITY_PATERNITY'
  | 'UNPAID_LEAVE';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// -----------------------------------------------------------------------------
// 1. STAFF PROFILE MASTER
// -----------------------------------------------------------------------------

export interface StaffMemberDetail {
  id: string;
  organizationId: string;
  userId: string;
  employeeCode: string; // e.g. EMP-HYD-001
  displayName: string;
  fullName?: string;
  jobTitle: string;
  staffType: StaffRoleType;
  phone?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  joiningDate: string;
  specialization: string[];
  skills: string[];
  assignedServiceIds: string[];
  assignedServiceNames?: string[];
  commissionType: CommissionType;
  commissionRate: number; // e.g. 15.00%
  monthlyRevenueTarget: number; // e.g. 150000.00
  monthlyServiceTarget: number; // e.g. 60
  achievedMonthlyRevenue?: number;
  achievedMonthlyServices?: number;
  isAvailableForBooking: boolean;
  status: StaffStatus;
  primaryBranchId?: string | null;
  primaryBranchName?: string | null;
  assignedBranchIds: string[];
  assignedBranchNames?: string[];
  workingHours?: Record<string, { start: string; end: string; isOff: boolean }> | null;
  todayShift?: string | null;
  todayAttendanceStatus?: AttendanceStatus | null;
  todayCheckInTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDto {
  displayName: string;
  employeeCode: string;
  jobTitle: string;
  staffType: StaffRoleType;
  phone?: string;
  email?: string;
  joiningDate?: string;
  specialization?: string[];
  skills?: string[];
  assignedServiceIds?: string[];
  commissionType?: CommissionType;
  commissionRate?: number;
  monthlyRevenueTarget?: number;
  monthlyServiceTarget?: number;
  primaryBranchId?: string;
  assignedBranchIds?: string[];
  isAvailableForBooking?: boolean;
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {
  status?: StaffStatus;
}

// -----------------------------------------------------------------------------
// 2. SHIFT TEMPLATES & ROSTERS
// -----------------------------------------------------------------------------

export interface ShiftTemplateDetail {
  id: string;
  organizationId: string;
  branchId?: string | null;
  name: string; // Morning Shift, Evening Shift, Full Day, Split Shift
  code: string; // MORN, EVEN, FULL, SPLIT
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  breakDurationMinutes: number; // e.g. 60
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftTemplateDto {
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakDurationMinutes?: number;
  color?: string;
  branchId?: string;
}

export interface StaffRosterDetail {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  staffType: StaffRoleType;
  shiftTemplateId?: string | null;
  shiftName?: string | null;
  shiftCode?: string | null;
  shiftColor?: string | null;
  date: string; // "YYYY-MM-DD"
  dayOfWeek: string;
  startTime?: string | null;
  endTime?: string | null;
  isOffDay: boolean;
  isHoliday: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RosterAssignmentPayload {
  branchId: string;
  staffId: string;
  date: string; // "YYYY-MM-DD"
  shiftTemplateId?: string;
  isOffDay?: boolean;
  notes?: string;
}

// -----------------------------------------------------------------------------
// 3. ATTENDANCE & BIOMETRICS
// -----------------------------------------------------------------------------

export interface AttendanceRecordDetail {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  staffType: StaffRoleType;
  date: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: AttendanceStatus;
  checkInMethod: CheckInMethod;
  lateMinutes: number;
  earlyExitMinutes: number;
  overtimeMinutes: number;
  totalWorkingHours: number;
  breakMinutes: number;
  isOnBreak?: boolean;
  breakStartTime?: string | null;
  biometricDeviceId?: string | null;
  biometricSyncToken?: string | null;
  notes?: string | null;
  approvedByName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendancePunchPayload {
  staffId: string;
  branchId: string;
  action: 'CHECK_IN' | 'CHECK_OUT' | 'START_BREAK' | 'END_BREAK';
  method?: CheckInMethod;
  biometricDeviceId?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface ManualAttendancePayload {
  staffId: string;
  branchId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  notes: string;
  performedByName?: string;
}

// -----------------------------------------------------------------------------
// 4. LEAVE MANAGEMENT
// -----------------------------------------------------------------------------

export interface LeaveRequestDetail {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  staffType: StaffRoleType;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  isHalfDay: boolean;
  reason: string;
  status: LeaveStatus;
  reviewedByUserId?: string | null;
  reviewedByName?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyLeavePayload {
  staffId: string;
  branchId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays?: number;
  isHalfDay?: boolean;
  reason: string;
}

export interface ReviewLeavePayload {
  action: 'APPROVE' | 'REJECT' | 'CANCEL';
  reviewNotes?: string;
  reviewerName?: string;
}

export interface LeaveBalanceDetail {
  staffId: string;
  staffName: string;
  year: number;
  casualLeave: { total: number; used: number; available: number };
  sickLeave: { total: number; used: number; available: number };
  earnedLeave: { total: number; used: number; available: number };
  totalAvailable: number;
}

// -----------------------------------------------------------------------------
// 5. EMPLOYEE SELF-SERVICE DASHBOARD & PERFORMANCE
// -----------------------------------------------------------------------------

export interface StaffTodayAppointment {
  id: string;
  appointmentNumber: string;
  customerName: string;
  customerPhone?: string | null;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  chairNumber?: string;
  clientNotes?: string | null;
}

export interface StaffDashboardSummary {
  staffMember: StaffMemberDetail;
  todayAttendance: {
    isCheckedIn: boolean;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    isOnBreak: boolean;
    breakStartTime?: string | null;
    status: AttendanceStatus;
    totalHoursWorkedToday: number;
    shiftName: string;
    shiftTiming: string;
  };
  performance: {
    todayRevenue: number;
    todayServicesCount: number;
    estimatedDailyCommission: number;
    monthlyRevenueTarget: number;
    monthToDateRevenue: number;
    targetProgressPercentage: number;
    monthToDateCommission: number;
    rankInBranch: number;
    totalStaffInBranch: number;
  };
  todayAppointments: StaffTodayAppointment[];
  upcomingAppointmentsCount: number;
  leaveBalance: LeaveBalanceDetail;
  recentAttendanceLogs: AttendanceRecordDetail[];
}

export interface StaffManagerOverview {
  totalStaffCount: number;
  presentTodayCount: number;
  inServiceCount: number;
  onBreakCount: number;
  lateTodayCount: number;
  onLeaveTodayCount: number;
  pendingLeaveRequestsCount: number;
  topPerformingStaff: Array<{
    staffId: string;
    staffName: string;
    staffType: StaffRoleType;
    branchName: string;
    revenueThisMonth: number;
    commissionEarned: number;
    targetAchievementPercentage: number;
    servicesCompleted: number;
  }>;
}
