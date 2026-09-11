/**
 * Phase 6: Appointment Scheduling, Calendar, Walk-ins & Queue Types
 */

export type AppointmentStatus =
  | 'BOOKED'
  | 'CONFIRMED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED';

export type CalendarViewMode =
  | 'day'
  | 'week'
  | 'month'
  | 'staff'
  | 'branch';

export interface AppointmentServiceItem {
  id?: string;
  appointmentId?: string;
  serviceId: string;
  serviceName: string;
  staffId?: string | null;
  staffName?: string | null;
  sequenceOrder: number;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
  taxRate: number;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
}

export interface AppointmentNotificationItem {
  id: string;
  appointmentId: string;
  type: 'CONFIRMATION' | 'REMINDER_24H' | 'REMINDER_2H' | 'CANCELLATION' | 'RESCHEDULE';
  channel: 'SMS' | 'WHATSAPP' | 'EMAIL';
  recipient: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt: string;
}

export interface AppointmentItem {
  id: string;
  appointmentNumber: string;
  organizationId: string;
  branchId: string;
  branchName?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  staffId: string;
  staffName: string;
  staffRole?: string;
  serviceId: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  isWalkIn: boolean;
  queueToken?: string | null;
  queueStatus?: QueueStatus | null;
  checkedInAt?: string | null;
  serviceStartedAt?: string | null;
  serviceCompletedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  bufferMinutes: number;
  totalDurationMinutes: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  source: 'FRONT_DESK' | 'ONLINE_PORTAL' | 'MOBILE_APP' | 'WALK_IN';
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_PAID';
  notes?: string | null;
  clientPreferences?: string | null;
  chairNumber?: string | null;
  services?: AppointmentServiceItem[];
  notifications?: AppointmentNotificationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  branchId: string;
  staffId: string;
  serviceId: string;
  startTime: string;
  services?: Array<{
    serviceId: string;
    staffId?: string;
    sequenceOrder?: number;
  }>;
  bufferMinutes?: number;
  notes?: string;
  clientPreferences?: string;
  source?: 'FRONT_DESK' | 'ONLINE_PORTAL' | 'MOBILE_APP' | 'WALK_IN';
}

export interface CreateWalkInDto {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  branchId: string;
  serviceId: string;
  staffId?: string;
  notes?: string;
  clientPreferences?: string;
}

export interface RescheduleAppointmentDto {
  startTime: string;
  staffId?: string;
  branchId?: string;
  reason?: string;
}

export interface CheckInDto {
  appointmentId: string;
  notes?: string;
  chairNumber?: string;
}

export interface CollisionCheckResult {
  hasConflict: boolean;
  conflictingAppointment?: {
    id: string;
    appointmentNumber: string;
    customerName: string;
    staffName: string;
    startTime: string;
    endTime: string;
  } | null;
  message?: string;
}

export interface QueueTicketItem {
  id: string;
  appointmentId: string;
  tokenNumber: string; // e.g. "W-01"
  customerName: string;
  customerPhone: string;
  serviceName: string;
  staffName?: string | null;
  branchId: string;
  branchName: string;
  status: QueueStatus;
  waitStartTime: string;
  estimatedWaitMinutes: number;
  calledAt?: string | null;
  serviceStartedAt?: string | null;
  notes?: string | null;
}
