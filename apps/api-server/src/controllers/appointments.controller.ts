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
  const targetBranch = branchId || req.activeBranchId;

  const query: any = { organizationId: req.organizationId };
  if (targetBranch && targetBranch !== 'undefined' && targetBranch !== 'null' && mongoose.Types.ObjectId.isValid(String(targetBranch))) {
    query.branchId = targetBranch;
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
  const targetBranch = req.query.branchId || req.activeBranchId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const query: any = {
    organizationId: req.organizationId,
    appointmentDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    status: { $in: ['CHECKED_IN', 'IN_SERVICE', 'SCHEDULED', 'CONFIRMED'] },
  };

  if (targetBranch && targetBranch !== 'undefined' && targetBranch !== 'null' && mongoose.Types.ObjectId.isValid(String(targetBranch))) {
    query.branchId = targetBranch;
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

  // Calculate end time
  const [hours, mins] = startTime.split(':').map(Number);
  const startTotalMinutes = hours * 60 + mins;
  const endTotalMinutes = startTotalMinutes + Number(durationMinutes);
  const endHours = Math.floor(endTotalMinutes / 60).toString().padStart(2, '0');
  const endMins = (endTotalMinutes % 60).toString().padStart(2, '0');
  const endTime = `${endHours}:${endMins}`;

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
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.organizationId },
    { status, cancelledReason },
    { new: true }
  );

  if (!appointment) {
    res.status(404).json({ success: false, message: 'Appointment not found' });
    return;
  }

  res.json({ success: true, data: appointment });
});
