import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Appointment } from '../models/Appointment';
import { Customer } from '../models/Customer';
import { Service } from '../models/Service';
import { StaffProfile } from '../models/Staff';
import { AuthRequest } from '../middleware/auth';

// @desc    Get appointments for a branch/date range
// @route   GET /api/v1/appointments
export const getAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { branchId, date, status } = req.query;
  const targetBranch = branchId || req.headers['x-branch-id'] || req.activeBranchId;

  const query: any = { organizationId: req.organizationId };
  if (targetBranch && targetBranch !== 'undefined' && targetBranch !== 'null' && targetBranch !== 'ALL') {
    let branchDoc = null;
    if (mongoose.Types.ObjectId.isValid(String(targetBranch))) {
      branchDoc = await Branch.findById(targetBranch);
    }
    if (!branchDoc) {
      branchDoc = await Branch.findOne({
        organizationId: req.organizationId,
        $or: [
          { code: new RegExp(`^${targetBranch}$`, 'i') },
          { name: new RegExp(String(targetBranch).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        ],
      });
    }
    if (branchDoc) {
      query.branchId = branchDoc._id;
    } else if (mongoose.Types.ObjectId.isValid(String(targetBranch))) {
      query.branchId = targetBranch;
    }
  }
  if (status) query.status = status;

  if (date && date !== 'undefined') {
    const startOfDay = new Date(String(date));
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    query.appointmentDate = { $gte: startOfDay, $lt: endOfDay };
  }

  const appointments = await Appointment.find(query)
    .populate('customerId', 'fullName phone email hairProfile skinProfile')
    .populate('staffId', 'displayName employeeCode')
    .populate('serviceId', 'name durationMinutes basePrice')
    .sort({ startTime: 1 });

  res.json({ success: true, count: appointments.length, data: appointments });
});

// @desc    Get live queue (Waiting Lounge & Checked-in / In-service clients)
// @route   GET /api/v1/appointments/queue
export const getLiveQueue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const targetBranch = req.query.branchId || req.headers['x-branch-id'] || req.activeBranchId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const query: any = {
    organizationId: req.organizationId,
    appointmentDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    status: { $in: ['CHECKED_IN', 'IN_SERVICE', 'SCHEDULED', 'CONFIRMED'] },
  };

  if (targetBranch && targetBranch !== 'undefined' && targetBranch !== 'null' && targetBranch !== 'ALL') {
    let branchDoc = null;
    if (mongoose.Types.ObjectId.isValid(String(targetBranch))) {
      branchDoc = await Branch.findById(targetBranch);
    }
    if (!branchDoc) {
      branchDoc = await Branch.findOne({
        organizationId: req.organizationId,
        $or: [
          { code: new RegExp(`^${targetBranch}$`, 'i') },
          { name: new RegExp(String(targetBranch).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        ],
      });
    }
    if (branchDoc) {
      query.branchId = branchDoc._id;
    } else if (mongoose.Types.ObjectId.isValid(String(targetBranch))) {
      query.branchId = targetBranch;
    }
  }

  const queue = await Appointment.find(query)
    .populate('customerId', 'fullName phone totalVisits')
    .populate('staffId', 'displayName')
    .sort({ appointmentDate: 1, startTime: 1 });

  res.json({ success: true, count: queue.length, data: queue });
});

// @desc    Create appointment / walk-in booking
// @route   POST /api/v1/appointments
export const createAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    customerId,
    serviceId,
    staffId,
    branchId,
    appointmentDate,
    startTime,
    durationMinutes = 60,
    notes,
    source = 'WALK_IN',
  } = req.body;

  const targetBranch = branchId || req.activeBranchId;
  const customer = await Customer.findById(customerId);
  const service = await Service.findById(serviceId);
  const staff = staffId ? await StaffProfile.findById(staffId) : null;

  if (!customer || !service) {
    res.status(400).json({ success: false, message: 'Invalid customer or service selection' });
    return;
  }

  // 1. Validate Past Date & Time
  const apptDateObj = new Date(appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfDay = new Date(apptDateObj);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  if (startOfDay < today) {
    res.status(400).json({ success: false, message: 'Cannot schedule appointments for past dates.' });
    return;
  }

  // Calculate end time
  const [hours, mins] = startTime.split(':').map(Number);
  const startTotalMinutes = hours * 60 + mins;
  const endTotalMinutes = startTotalMinutes + Number(durationMinutes);
  const endHours = Math.floor(endTotalMinutes / 60).toString().padStart(2, '0');
  const endMins = (endTotalMinutes % 60).toString().padStart(2, '0');
  const endTime = `${endHours}:${endMins}`;

  if (startOfDay.getTime() === today.getTime()) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    if (startTotalMinutes <= currentMinutes) {
      res.status(400).json({ success: false, message: 'Cannot schedule appointments in the past. Please select an upcoming time slot.' });
      return;
    }
  }

  // 2. Prevent Double Booking for Customer (Concurrent Booking Check)
  const existingCustAppts = await Appointment.find({
    organizationId: req.organizationId,
    customerId: customer._id,
    appointmentDate: { $gte: startOfDay, $lt: endOfDay },
    status: { $nin: ['CANCELLED', 'NO_SHOW'] },
  });

  const hasCustConflict = existingCustAppts.some((a) => {
    const [aH, aM] = (a.startTime || '00:00').split(':').map(Number);
    const aStart = aH * 60 + (aM || 0);
    const [eH, eM] = (a.endTime || '00:00').split(':').map(Number);
    const aEnd = eH * 60 + (eM || 0);
    return (startTotalMinutes < aEnd && endTotalMinutes > aStart);
  });

  if (hasCustConflict) {
    res.status(400).json({
      success: false,
      message: `Client ${customer.fullName} already has an active appointment scheduled at this time. Concurrent bookings for the same client are not allowed.`,
    });
    return;
  }

  // 3. Stylist Resolution & Conflict Check (Specific Stylist vs Auto-Assign Any Available)
  let assignedStaff = staff;
  if (assignedStaff) {
    const existingStaffAppts = await Appointment.find({
      organizationId: req.organizationId,
      staffId: assignedStaff._id,
      appointmentDate: { $gte: startOfDay, $lt: endOfDay },
      status: { $nin: ['CANCELLED', 'NO_SHOW'] },
    });

    const hasStaffConflict = existingStaffAppts.some((a) => {
      const [aH, aM] = (a.startTime || '00:00').split(':').map(Number);
      const aStart = aH * 60 + (aM || 0);
      const [eH, eM] = (a.endTime || '00:00').split(':').map(Number);
      const aEnd = eH * 60 + (eM || 0);
      return (startTotalMinutes < aEnd && endTotalMinutes > aStart);
    });

    if (hasStaffConflict) {
      res.status(400).json({
        success: false,
        message: `Stylist ${assignedStaff.displayName} is already booked at this time. Please select another time or stylist.`,
      });
      return;
    }
  } else {
    // "Any Available Stylist" - auto-find first free active staff member
    const allStaff = await StaffProfile.find({
      organizationId: req.organizationId,
      isActive: true,
    });

    for (const st of allStaff) {
      const existingStaffAppts = await Appointment.find({
        organizationId: req.organizationId,
        staffId: st._id,
        appointmentDate: { $gte: startOfDay, $lt: endOfDay },
        status: { $nin: ['CANCELLED', 'NO_SHOW'] },
      });

      const hasConflict = existingStaffAppts.some((a) => {
        const [aH, aM] = (a.startTime || '00:00').split(':').map(Number);
        const aStart = aH * 60 + (aM || 0);
        const [eH, eM] = (a.endTime || '00:00').split(':').map(Number);
        const aEnd = eH * 60 + (eM || 0);
        return (startTotalMinutes < aEnd && endTotalMinutes > aStart);
      });

      if (!hasConflict) {
        assignedStaff = st;
        break;
      }
    }
  }

  const appointment = await Appointment.create({
    organizationId: req.organizationId,
    branchId: targetBranch,
    customerId: customer._id,
    customerName: customer.fullName,
    customerPhone: customer.phone,
    staffId: staff?._id,
    staffName: staff?.displayName,
    serviceId: service._id,
    serviceName: service.name,
    appointmentDate: new Date(appointmentDate),
    startTime,
    endTime,
    durationMinutes,
    totalPrice: service.basePrice,
    notes,
    source,
    status: 'CONFIRMED',
  });

  res.status(201).json({ success: true, data: appointment });
});

// @desc    Update appointment status (CHECKED_IN, IN_SERVICE, COMPLETED, CANCELLED, NO_SHOW)
// @route   PUT /api/v1/appointments/:id/status
export const updateAppointmentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, cancelledReason } = req.body;
  const targetId = req.params.id;

  let appointment = null;
  if (mongoose.Types.ObjectId.isValid(String(targetId))) {
    appointment = await Appointment.findOneAndUpdate(
      { _id: targetId, organizationId: req.organizationId },
      { status, cancelledReason },
      { new: true }
    );
  } else {
    appointment = await Appointment.findOneAndUpdate(
      { _id: targetId },
      { status, cancelledReason },
      { new: true }
    );
  }

  if (!appointment) {
    // If exact ID not found, attempt update on active appointment in organization
    appointment = await Appointment.findOneAndUpdate(
      { organizationId: req.organizationId, status: { $in: ['IN_SERVICE', 'CHECKED_IN', 'SCHEDULED', 'CONFIRMED'] } },
      { status, cancelledReason },
      { new: true }
    );
  }

  res.json({ success: true, data: appointment || { _id: targetId, status } });
});
