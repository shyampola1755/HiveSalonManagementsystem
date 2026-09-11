import { z } from 'zod';

export const staffRoleTypeSchema = z.enum([
  'STYLIST',
  'HAIRDRESSER',
  'BEAUTICIAN',
  'THERAPIST',
  'NAIL_ARTIST',
  'MAKEUP_ARTIST',
  'TATTOO_ARTIST',
  'FRONT_DESK',
  'MANAGER',
  'ACCOUNTANT',
]);

export const staffStatusSchema = z.enum(['ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TERMINATED']);

export const commissionTypeSchema = z.enum(['PERCENTAGE', 'FIXED', 'TIERED']);

export const attendanceStatusSchema = z.enum([
  'PRESENT',
  'LATE',
  'HALF_DAY',
  'ABSENT',
  'ON_LEAVE',
  'OVERTIME',
]);

export const checkInMethodSchema = z.enum([
  'WEB_PORTAL',
  'MOBILE_GPS',
  'BIOMETRIC_DEVICE',
  'RFID_CARD',
  'MANUAL_MANAGER',
]);

export const leaveTypeSchema = z.enum([
  'CASUAL_LEAVE',
  'SICK_LEAVE',
  'EARNED_LEAVE',
  'MATERNITY_PATERNITY',
  'UNPAID_LEAVE',
]);

export const createStaffSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  employeeCode: z.string().min(2, 'Employee Code is required'),
  jobTitle: z.string().min(2, 'Job Title is required'),
  staffType: staffRoleTypeSchema.default('STYLIST'),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable(),
  joiningDate: z.string().optional(),
  specialization: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  assignedServiceIds: z.array(z.string()).default([]),
  commissionType: commissionTypeSchema.default('PERCENTAGE'),
  commissionRate: z.number().min(0).max(100).default(15.0),
  monthlyRevenueTarget: z.number().min(0).default(100000.0),
  monthlyServiceTarget: z.number().int().min(0).default(60),
  primaryBranchId: z.string().optional().nullable(),
  assignedBranchIds: z.array(z.string()).default([]),
  isAvailableForBooking: z.boolean().default(true),
});

export const updateStaffSchema = createStaffSchema.partial().extend({
  status: staffStatusSchema.optional(),
});

export const shiftTemplateSchema = z.object({
  name: z.string().min(2, 'Shift name is required'),
  code: z.string().min(2, 'Shift code is required'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM (e.g. 09:00)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM (e.g. 18:00)'),
  breakDurationMinutes: z.number().int().min(0).default(60),
  color: z.string().optional().default('#d97706'),
  branchId: z.string().optional().nullable(),
});

export const rosterScheduleSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  staffId: z.string().min(1, 'Staff member is required'),
  date: z.string().min(1, 'Date is required'),
  shiftTemplateId: z.string().optional().nullable(),
  isOffDay: z.boolean().default(false),
  notes: z.string().optional().nullable(),
});

export const attendancePunchSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  action: z.enum(['CHECK_IN', 'CHECK_OUT', 'START_BREAK', 'END_BREAK']),
  method: checkInMethodSchema.default('WEB_PORTAL'),
  biometricDeviceId: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const manualAttendanceSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  date: z.string().min(1, 'Date is required'),
  checkInTime: z.string().optional().nullable(),
  checkOutTime: z.string().optional().nullable(),
  status: attendanceStatusSchema.default('PRESENT'),
  notes: z.string().min(3, 'Manager explanation is required'),
  performedByName: z.string().optional(),
});

export const applyLeaveSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  leaveType: leaveTypeSchema.default('CASUAL_LEAVE'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  totalDays: z.number().positive().default(1.0),
  isHalfDay: z.boolean().default(false),
  reason: z.string().min(3, 'Reason for leave is required'),
});

export const reviewLeaveSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'CANCEL']),
  reviewNotes: z.string().optional().nullable(),
  reviewerName: z.string().optional(),
});
