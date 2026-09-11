import { z } from 'zod';

export const createAppointmentSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  branchId: z.string().min(1, 'Branch selection is required'),
  staffId: z.string().min(1, 'Staff assignment is required'),
  serviceId: z.string().min(1, 'Primary service is required'),
  startTime: z.string().datetime({ message: 'Valid start timestamp is required' }),
  services: z
    .array(
      z.object({
        serviceId: z.string().min(1),
        staffId: z.string().optional(),
        sequenceOrder: z.number().int().positive().optional(),
      })
    )
    .optional(),
  bufferMinutes: z.number().int().min(0).max(120).optional().default(15),
  notes: z.string().max(1000).optional(),
  clientPreferences: z.string().max(500).optional(),
  source: z.enum(['FRONT_DESK', 'ONLINE_PORTAL', 'MOBILE_APP', 'WALK_IN']).optional().default('FRONT_DESK'),
});

export const createWalkInSchema = z.object({
  customerName: z.string().min(2, 'Customer full name is required'),
  customerPhone: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  branchId: z.string().min(1, 'Branch selection is required'),
  serviceId: z.string().min(1, 'Service selection is required'),
  staffId: z.string().optional(),
  notes: z.string().max(500).optional(),
  clientPreferences: z.string().max(300).optional(),
});

export const rescheduleAppointmentSchema = z.object({
  startTime: z.string().datetime({ message: 'Valid new start timestamp is required' }),
  staffId: z.string().optional(),
  branchId: z.string().optional(),
  reason: z.string().max(300).optional(),
});

export const checkInSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  chairNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    'BOOKED',
    'CONFIRMED',
    'ARRIVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
  ]),
  cancellationReason: z.string().optional(),
});

export const queueTransitionSchema = z.object({
  status: z.enum(['WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED', 'CANCELLED']),
  chairNumber: z.string().optional(),
  staffId: z.string().optional(),
});

export const collisionCheckSchema = z.object({
  staffId: z.string().min(1),
  branchId: z.string().min(1),
  startTime: z.string().datetime(),
  durationMinutes: z.number().int().positive(),
  bufferMinutes: z.number().int().min(0).optional().default(15),
  excludeAppointmentId: z.string().optional(),
});
