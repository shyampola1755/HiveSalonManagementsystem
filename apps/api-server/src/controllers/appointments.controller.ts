import { Response } from 'express';
import asyncHandler from 'express-async-handler';
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
  if (targetBranch) query.branchId = targetBranch;
  if (status) query.status = status;

  if (date) {
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

  if (targetBranch) query.branchId = targetBranch;

  const queue = await Appointment.find(query)
    .populate('customerId', 'fullName phone totalVisits')
    .populate('staffId', 'displayName')
    .sort({ appointmentDate: 1, startTime: 1 });

  res.json({ success: true, count: queue.length, data: queue });
});

// @desc    Create appointment / walk-in booking
// @route   POST /api/v1/appointments
export const createAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { customerId, serviceId, staffId, appointmentDate, startTime, durationMinutes = 60, status, notes } = req.body;

  let customer = await Customer.findById(customerId);
  let service = await Service.findById(serviceId);

  if (!service) {
    res.status(400).json({ success: false, message: 'Service not found' });
    return;
  }

  let staff = staffId ? await StaffProfile.findById(staffId) : null;

  // Calculate end time
  const [hours, minutes] = startTime.split(':').map(Number);
  const endTotalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(endTotalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const endMins = (endTotalMinutes % 60).toString().padStart(2, '0');
  const endTime = `${endHours}:${endMins}`;

  const appointment = await Appointment.create({
    organizationId: req.organizationId,
    branchId: req.body.branchId || req.activeBranchId,
    customerId,
    customerName: customer ? customer.fullName : req.body.customerName || 'Walk-in Guest',
    customerPhone: customer ? customer.phone : req.body.customerPhone || '',
    staffId: staff ? staff._id : undefined,
    staffName: staff ? staff.displayName : 'Any Available',
    serviceId,
    serviceName: service.name,
    appointmentDate: new Date(appointmentDate),
    startTime,
    endTime,
    durationMinutes,
    status: status || 'SCHEDULED',
    totalPrice: service.basePrice,
    notes,
  });

  res.status(201).json({ success: true, data: appointment });
});

// @desc    Update appointment status (e.g. CHECK_IN, START_SERVICE, COMPLETE, CANCEL)
// @route   PUT /api/v1/appointments/:id/status
export const updateAppointmentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, staffId, notes, cancelledReason } = req.body;

  const updateData: any = { status };
  if (notes) updateData.notes = notes;
  if (cancelledReason) updateData.cancelledReason = cancelledReason;
  if (staffId) {
    const staff = await StaffProfile.findById(staffId);
    if (staff) {
      updateData.staffId = staff._id;
      updateData.staffName = staff.displayName;
    }
  }

  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.organizationId },
    updateData,
    { new: true }
  );

  if (!appointment) {
    res.status(404).json({ success: false, message: 'Appointment not found' });
    return;
  }

  res.json({ success: true, data: appointment });
});
