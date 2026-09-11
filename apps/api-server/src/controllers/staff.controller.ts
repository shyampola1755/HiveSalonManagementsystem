import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { StaffProfile, ShiftTemplate, StaffAttendanceRecord, StaffLeaveRequest } from '../models/Staff';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all staff members for organization/branch
// @route   GET /api/v1/staff
export const getStaff = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { branchId, staffType, status = 'ACTIVE' } = req.query;
  const query: any = { organizationId: req.organizationId, deletedAt: null };

  if (status) query.status = status;
  if (staffType) query.staffType = staffType;
  if (branchId) {
    query.$or = [{ primaryBranchId: branchId }, { assignedBranchIds: branchId }];
  }

  const staff = await StaffProfile.find(query)
    .populate('primaryBranchId', 'name code')
    .populate('userId', 'email fullName avatarUrl role')
    .sort({ displayName: 1 });

  res.json({ success: true, count: staff.length, data: staff });
});

// @desc    Create new staff profile & login user
// @route   POST /api/v1/staff
export const createStaff = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    fullName,
    email,
    password = 'Password123!',
    phone,
    role = 'STYLIST',
    staffType = 'STYLIST',
    jobTitle = 'Senior Stylist',
    primaryBranchId,
    commissionRate = 20,
    monthlyRevenueTarget = 100000,
    specialization = [],
  } = req.body;

  if (!fullName || !email || !primaryBranchId) {
    res.status(400).json({ success: false, message: 'Please provide full name, email, and branch assignment.' });
    return;
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  let user = existingUser;
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({
      organizationId: req.organizationId,
      email: email.toLowerCase(),
      phone: phone || '+91 90000 00000',
      fullName,
      passwordHash,
      role,
      primaryBranchId,
      branches: [primaryBranchId],
    });
  }

  // Create staff profile
  const employeeCount = await StaffProfile.countDocuments({ organizationId: req.organizationId });
  const employeeCode = `EMP-${(employeeCount + 1).toString().padStart(3, '0')}`;

  const staff = await StaffProfile.create({
    organizationId: req.organizationId,
    userId: user._id,
    employeeCode,
    displayName: fullName,
    jobTitle,
    staffType,
    specialization: Array.isArray(specialization) ? specialization : [specialization],
    commissionRate,
    monthlyRevenueTarget,
    primaryBranchId,
    assignedBranchIds: [primaryBranchId],
  });

  const populatedStaff = await StaffProfile.findById(staff._id)
    .populate('primaryBranchId', 'name code')
    .populate('userId', 'email fullName avatarUrl role');

  res.status(201).json({ success: true, data: populatedStaff });
});

// @desc    Get staff attendance logs
// @route   GET /api/v1/staff/attendance
export const getAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { branchId, date } = req.query;
  const targetDate = date ? new Date(String(date)) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const query: any = {
    organizationId: req.organizationId,
    date: {
      $gte: targetDate,
      $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
    },
  };

  if (branchId) query.branchId = branchId;

  const records = await StaffAttendanceRecord.find(query)
    .populate('staffId', 'displayName employeeCode staffType')
    .populate('branchId', 'name code')
    .sort({ checkInTime: -1 });

  res.json({ success: true, count: records.length, data: records });
});

// @desc    Clock in/out staff attendance
// @route   POST /api/v1/staff/attendance/clock
export const clockAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { staffId, branchId, action, notes } = req.body; // action: 'CHECK_IN' | 'CHECK_OUT'
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let record = await StaffAttendanceRecord.findOne({
    staffId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  });

  if (action === 'CHECK_IN') {
    if (!record) {
      record = await StaffAttendanceRecord.create({
        organizationId: req.organizationId,
        branchId: branchId || req.activeBranchId,
        staffId,
        date: new Date(),
        checkInTime: new Date(),
        status: 'PRESENT',
        notes,
      });
    } else {
      record.checkInTime = new Date();
      record.status = 'PRESENT';
      if (notes) record.notes = notes;
      await record.save();
    }
  } else if (action === 'CHECK_OUT') {
    if (record) {
      record.checkOutTime = new Date();
      if (record.checkInTime) {
        const hours = (record.checkOutTime.getTime() - record.checkInTime.getTime()) / (1000 * 60 * 60);
        record.totalWorkingHours = Math.round(hours * 100) / 100;
      }
      if (notes) record.notes = notes;
      await record.save();
    }
  }

  res.json({ success: true, data: record });
});

// @desc    Get leave requests
// @route   GET /api/v1/staff/leaves
export const getLeaves = asyncHandler(async (req: AuthRequest, res: Response) => {
  const leaves = await StaffLeaveRequest.find({ organizationId: req.organizationId })
    .populate('staffId', 'displayName employeeCode')
    .populate('branchId', 'name')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: leaves.length, data: leaves });
});

// @desc    Approve/Reject leave request
// @route   PUT /api/v1/staff/leaves/:id
export const updateLeaveStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, reviewNotes } = req.body;
  const leave = await StaffLeaveRequest.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.organizationId },
    {
      status,
      reviewNotes,
      reviewedByUserId: req.user?._id,
    },
    { new: true }
  );

  if (!leave) {
    res.status(404).json({ success: false, message: 'Leave request not found' });
    return;
  }

  res.json({ success: true, data: leave });
});
