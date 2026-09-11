import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IStaffProfile extends Document {
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  employeeCode: string;
  displayName: string;
  jobTitle: string;
  staffType: 'STYLIST' | 'HAIRDRESSER' | 'BEAUTICIAN' | 'THERAPIST' | 'NAIL_ARTIST' | 'MAKEUP_ARTIST' | 'FRONT_DESK' | 'MANAGER' | 'ACCOUNTANT';
  phone?: string;
  email?: string;
  joiningDate: Date;
  specialization: string[];
  skills: string[];
  assignedServiceIds: Types.ObjectId[];
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED';
  commissionRate: number;
  monthlyRevenueTarget: number;
  monthlyServiceTarget: number;
  isAvailableForBooking: boolean;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE' | 'TERMINATED';
  primaryBranchId?: Types.ObjectId;
  assignedBranchIds: Types.ObjectId[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffProfileSchema = new Schema<IStaffProfile>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeCode: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    staffType: {
      type: String,
      enum: ['STYLIST', 'HAIRDRESSER', 'BEAUTICIAN', 'THERAPIST', 'NAIL_ARTIST', 'MAKEUP_ARTIST', 'FRONT_DESK', 'MANAGER', 'ACCOUNTANT'],
      default: 'STYLIST',
      index: true,
    },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    joiningDate: { type: Date, default: Date.now },
    specialization: [{ type: String }],
    skills: [{ type: String }],
    assignedServiceIds: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    commissionType: { type: String, enum: ['PERCENTAGE', 'FIXED', 'TIERED'], default: 'PERCENTAGE' },
    commissionRate: { type: Number, default: 15.0 },
    monthlyRevenueTarget: { type: Number, default: 100000 },
    monthlyServiceTarget: { type: Number, default: 60 },
    isAvailableForBooking: { type: Boolean, default: true, index: true },
    status: { type: String, enum: ['ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TERMINATED'], default: 'ACTIVE', index: true },
    primaryBranchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    assignedBranchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

StaffProfileSchema.index({ organizationId: 1, employeeCode: 1 }, { unique: true });

export const StaffProfile = mongoose.model<IStaffProfile>('StaffProfile', StaffProfileSchema);

// Shift Template
export interface IShiftTemplate extends Document {
  organizationId: Types.ObjectId;
  branchId?: Types.ObjectId;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakDurationMinutes: number;
  color?: string;
  isActive: boolean;
}

const ShiftTemplateSchema = new Schema<IShiftTemplate>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    name: { type: String, required: true },
    code: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    breakDurationMinutes: { type: Number, default: 60 },
    color: { type: String, default: '#f59e0b' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ShiftTemplate = mongoose.model<IShiftTemplate>('ShiftTemplate', ShiftTemplateSchema);

// Attendance Record
export interface IStaffAttendanceRecord extends Document {
  organizationId: Types.ObjectId;
  branchId: Types.ObjectId;
  staffId: Types.ObjectId;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE' | 'OVERTIME';
  checkInMethod: string;
  lateMinutes: number;
  overtimeMinutes: number;
  totalWorkingHours: number;
  notes?: string;
}

const StaffAttendanceRecordSchema = new Schema<IStaffAttendanceRecord>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'StaffProfile', required: true, index: true },
    date: { type: Date, required: true, index: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: { type: String, enum: ['PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'ON_LEAVE', 'OVERTIME'], default: 'PRESENT' },
    checkInMethod: { type: String, default: 'WEB_PORTAL' },
    lateMinutes: { type: Number, default: 0 },
    overtimeMinutes: { type: Number, default: 0 },
    totalWorkingHours: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const StaffAttendanceRecord = mongoose.model<IStaffAttendanceRecord>('StaffAttendanceRecord', StaffAttendanceRecordSchema);

// Leave Request
export interface IStaffLeaveRequest extends Document {
  organizationId: Types.ObjectId;
  branchId: Types.ObjectId;
  staffId: Types.ObjectId;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reviewedByUserId?: Types.ObjectId;
  reviewNotes?: string;
}

const StaffLeaveRequestSchema = new Schema<IStaffLeaveRequest>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'StaffProfile', required: true, index: true },
    leaveType: { type: String, default: 'CASUAL_LEAVE' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, default: 1 },
    reason: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'], default: 'PENDING', index: true },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewNotes: { type: String },
  },
  { timestamps: true }
);

export const StaffLeaveRequest = mongoose.model<IStaffLeaveRequest>('StaffLeaveRequest', StaffLeaveRequestSchema);
