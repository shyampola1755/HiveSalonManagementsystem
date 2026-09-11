import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import type {
  AppointmentItem,
  AppointmentStatus,
  QueueStatus,
  CreateAppointmentDto,
  CreateWalkInDto,
  RescheduleAppointmentDto,
  CheckInDto,
  CollisionCheckResult,
  QueueTicketItem,
  AppointmentNotificationItem,
} from '@hive/types';

@Injectable()
export class AppointmentService {
  // In-memory persistent demo store
  private appointmentsDb = new Map<string, AppointmentItem>();
  private queueCounter = 1;

  constructor() {
    this.seedInitialAppointments();
  }

  private seedInitialAppointments() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const seeds: AppointmentItem[] = [
      {
        id: 'apt-001',
        appointmentNumber: `APT-${todayStr.replace(/-/g, '')}-001`,
        organizationId: 'org_hive_demo',
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        customerId: 'c1',
        customerName: 'Priya Sharma',
        customerPhone: '+91 98765 43210',
        customerEmail: 'priya.sharma@example.com',
        staffId: 'st-1',
        staffName: 'Aarav Mehta',
        staffRole: 'Master Stylist',
        serviceId: 'srv-2',
        serviceName: 'Balayage & Multi-Dimensional Glaze',
        startTime: `${todayStr}T10:00:00Z`,
        endTime: `${todayStr}T12:30:00Z`,
        status: 'IN_PROGRESS',
        isWalkIn: false,
        queueToken: null,
        queueStatus: null,
        checkedInAt: `${todayStr}T09:50:00Z`,
        serviceStartedAt: `${todayStr}T10:05:00Z`,
        serviceCompletedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        bufferMinutes: 30,
        totalDurationMinutes: 150,
        subtotal: 6800,
        taxAmount: 1224,
        totalAmount: 8024,
        source: 'ONLINE_PORTAL',
        paymentStatus: 'PAID',
        notes: 'Client has warm undertones. Use Olaplex No. 2 treatment.',
        clientPreferences: 'Prefers quiet sessions, warm green tea.',
        chairNumber: 'Chair #1',
        services: [
          {
            serviceId: 'srv-2',
            serviceName: 'Balayage & Multi-Dimensional Glaze',
            staffId: 'st-1',
            staffName: 'Aarav Mehta',
            sequenceOrder: 1,
            durationMinutes: 150,
            bufferMinutes: 30,
            price: 6800,
            taxRate: 18,
            startTime: `${todayStr}T10:00:00Z`,
            endTime: `${todayStr}T12:30:00Z`,
          },
        ],
        notifications: [
          {
            id: 'notif-1',
            appointmentId: 'apt-001',
            type: 'CONFIRMATION',
            channel: 'WHATSAPP',
            recipient: '+91 98765 43210',
            message: 'Your Balayage appointment is confirmed for today at 10:00 AM with Aarav Mehta.',
            status: 'SENT',
            sentAt: `${todayStr}T08:00:00Z`,
          },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'apt-002',
        appointmentNumber: `APT-${todayStr.replace(/-/g, '')}-002`,
        organizationId: 'org_hive_demo',
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        customerId: 'c2',
        customerName: 'Rahul Verma',
        customerPhone: '+91 98111 22334',
        customerEmail: 'rahul.verma@example.com',
        staffId: 'st-3',
        staffName: 'Vikram Sethi',
        staffRole: 'Senior Stylist',
        serviceId: 'srv-1',
        serviceName: 'Signature Royal Haircut & Beard Sculpting',
        startTime: `${todayStr}T11:30:00Z`,
        endTime: `${todayStr}T12:15:00Z`,
        status: 'ARRIVED',
        isWalkIn: false,
        queueToken: null,
        queueStatus: 'WAITING',
        checkedInAt: `${todayStr}T11:22:00Z`,
        serviceStartedAt: null,
        serviceCompletedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        bufferMinutes: 15,
        totalDurationMinutes: 45,
        subtotal: 850,
        taxAmount: 153,
        totalAmount: 1003,
        source: 'FRONT_DESK',
        paymentStatus: 'PENDING',
        notes: 'Requested low skin fade and beard contour.',
        clientPreferences: 'Prefers fast turnaround.',
        chairNumber: 'Chair #3',
        services: [
          {
            serviceId: 'srv-1',
            serviceName: 'Signature Royal Haircut & Beard Sculpting',
            staffId: 'st-3',
            staffName: 'Vikram Sethi',
            sequenceOrder: 1,
            durationMinutes: 45,
            bufferMinutes: 15,
            price: 850,
            taxRate: 18,
            startTime: `${todayStr}T11:30:00Z`,
            endTime: `${todayStr}T12:15:00Z`,
          },
        ],
        notifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'apt-003',
        appointmentNumber: `APT-${todayStr.replace(/-/g, '')}-003`,
        organizationId: 'org_hive_demo',
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        customerId: 'c3',
        customerName: 'Ananya Roy',
        customerPhone: '+91 99887 76655',
        customerEmail: 'ananya.roy@example.com',
        staffId: 'st-4',
        staffName: 'Ananya Roy',
        staffRole: 'Lead Aesthetician',
        serviceId: 'srv-3',
        serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
        startTime: `${todayStr}T14:00:00Z`,
        endTime: `${todayStr}T15:00:00Z`,
        status: 'CONFIRMED',
        isWalkIn: false,
        queueToken: null,
        queueStatus: null,
        checkedInAt: null,
        serviceStartedAt: null,
        serviceCompletedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        bufferMinutes: 15,
        totalDurationMinutes: 60,
        subtotal: 3400,
        taxAmount: 612,
        totalAmount: 4012,
        source: 'MOBILE_APP',
        paymentStatus: 'PENDING',
        notes: 'Pre-event skin prep. Extra suction on T-zone.',
        clientPreferences: 'Prefers lavender aromatherapy mist.',
        chairNumber: 'Medi-Spa Room 2',
        services: [
          {
            serviceId: 'srv-3',
            serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
            staffId: 'st-4',
            staffName: 'Ananya Roy',
            sequenceOrder: 1,
            durationMinutes: 60,
            bufferMinutes: 15,
            price: 3400,
            taxRate: 18,
            startTime: `${todayStr}T14:00:00Z`,
            endTime: `${todayStr}T15:00:00Z`,
          },
        ],
        notifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'apt-004',
        appointmentNumber: `APT-${todayStr.replace(/-/g, '')}-W01`,
        organizationId: 'org_hive_demo',
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        customerId: 'c4',
        customerName: 'Kavita Reddy',
        customerPhone: '+91 97000 11223',
        customerEmail: null,
        staffId: 'st-6',
        staffName: 'Meera Nambiar',
        staffRole: 'Senior Nail Artist',
        serviceId: 'srv-5',
        serviceName: 'Russian Gel Nail Architecture & Custom Art',
        startTime: `${todayStr}T11:45:00Z`,
        endTime: `${todayStr}T13:15:00Z`,
        status: 'ARRIVED',
        isWalkIn: true,
        queueToken: 'W-01',
        queueStatus: 'WAITING',
        checkedInAt: `${todayStr}T11:40:00Z`,
        serviceStartedAt: null,
        serviceCompletedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        bufferMinutes: 15,
        totalDurationMinutes: 90,
        subtotal: 2600,
        taxAmount: 468,
        totalAmount: 3068,
        source: 'WALK_IN',
        paymentStatus: 'PENDING',
        notes: 'Walk-in guest. French tips with chrome shimmer.',
        clientPreferences: null,
        chairNumber: 'Nail Station 1',
        services: [
          {
            serviceId: 'srv-5',
            serviceName: 'Russian Gel Nail Architecture & Custom Art',
            staffId: 'st-6',
            staffName: 'Meera Nambiar',
            sequenceOrder: 1,
            durationMinutes: 90,
            bufferMinutes: 15,
            price: 2600,
            taxRate: 18,
            startTime: `${todayStr}T11:45:00Z`,
            endTime: `${todayStr}T13:15:00Z`,
          },
        ],
        notifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    seeds.forEach((s) => this.appointmentsDb.set(s.id, s));
  }

  /**
   * List appointments with optional filters
   */
  async getAppointments(
    organizationId: string,
    filters: {
      branchId?: string;
      staffId?: string;
      status?: string;
      date?: string;
      search?: string;
    } = {}
  ): Promise<AppointmentItem[]> {
    const all = Array.from(this.appointmentsDb.values()).filter(
      (a) => a.organizationId === organizationId
    );

    return all.filter((a) => {
      if (filters.branchId && filters.branchId !== 'all' && a.branchId !== filters.branchId) {
        return false;
      }
      if (filters.staffId && filters.staffId !== 'all' && a.staffId !== filters.staffId) {
        return false;
      }
      if (filters.status && filters.status !== 'all' && a.status !== filters.status) {
        return false;
      }
      if (filters.date) {
        const aptDate = a.startTime.split('T')[0];
        if (aptDate !== filters.date) {
          return false;
        }
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchCust = a.customerName.toLowerCase().includes(q) || a.customerPhone.includes(q);
        const matchStaff = a.staffName.toLowerCase().includes(q);
        const matchSrv = a.serviceName.toLowerCase().includes(q);
        const matchNum = a.appointmentNumber.toLowerCase().includes(q);
        if (!matchCust && !matchStaff && !matchSrv && !matchNum) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Get appointment details by ID
   */
  async getAppointmentById(organizationId: string, id: string): Promise<AppointmentItem> {
    const apt = this.appointmentsDb.get(id);
    if (!apt || apt.organizationId !== organizationId) {
      throw new NotFoundException(`Appointment with ID "${id}" not found.`);
    }
    return apt;
  }

  /**
   * Double Booking Collision Prevention Check
   */
  async checkCollision(
    organizationId: string,
    staffId: string,
    branchId: string,
    startTimeStr: string,
    durationMinutes: number,
    bufferMinutes: number = 15,
    excludeAppointmentId?: string
  ): Promise<CollisionCheckResult> {
    const newStart = new Date(startTimeStr).getTime();
    const newEnd = newStart + durationMinutes * 60000;
    const newEndWithBuffer = newEnd + bufferMinutes * 60000;

    const existingAppointments = Array.from(this.appointmentsDb.values()).filter((a) => {
      if (a.organizationId !== organizationId) return false;
      if (a.staffId !== staffId) return false;
      if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;
      if (excludeAppointmentId && a.id === excludeAppointmentId) return false;
      return true;
    });

    for (const ex of existingAppointments) {
      const exStart = new Date(ex.startTime).getTime();
      const exEnd = new Date(ex.endTime).getTime();
      const exEndWithBuffer = exEnd + (ex.bufferMinutes || 0) * 60000;

      // Overlap condition: max(startA, startB) < min(endA_buf, endB_buf)
      const maxStart = Math.max(newStart, exStart);
      const minEnd = Math.min(newEndWithBuffer, exEndWithBuffer);

      if (maxStart < minEnd) {
        return {
          hasConflict: true,
          conflictingAppointment: {
            id: ex.id,
            appointmentNumber: ex.appointmentNumber,
            customerName: ex.customerName,
            staffName: ex.staffName,
            startTime: ex.startTime,
            endTime: ex.endTime,
          },
          message: `Schedule conflict: ${ex.staffName} already has appointment "${ex.appointmentNumber}" with ${ex.customerName} overlapping from ${new Date(ex.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(ex.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (including ${ex.bufferMinutes}m buffer).`,
        };
      }
    }

    return {
      hasConflict: false,
      conflictingAppointment: null,
      message: 'Slot is available with zero schedule collisions.',
    };
  }

  /**
   * Create new standard appointment with Double-Booking Protection
   */
  async createAppointment(organizationId: string, payload: CreateAppointmentDto): Promise<AppointmentItem> {
    const duration = 60; // Default service duration
    const buffer = payload.bufferMinutes || 15;

    // 1. Double Booking Check
    const collision = await this.checkCollision(
      organizationId,
      payload.staffId,
      payload.branchId,
      payload.startTime,
      duration,
      buffer
    );

    if (collision.hasConflict) {
      throw new ConflictException(collision.message);
    }

    const id = `apt-${Date.now()}`;
    const start = new Date(payload.startTime);
    const end = new Date(start.getTime() + duration * 60000);
    const dateStr = start.toISOString().split('T')[0].replace(/-/g, '');
    const randSeq = Math.floor(100 + Math.random() * 900);
    const appointmentNumber = `APT-${dateStr}-${randSeq}`;

    const subtotal = 1200;
    const taxAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + taxAmount;

    const newApt: AppointmentItem = {
      id,
      appointmentNumber,
      organizationId,
      branchId: payload.branchId,
      branchName: payload.branchId === 'br-jubilee' ? 'Jubilee Hills Flagship' : 'Banjara Hills Premium',
      customerId: payload.customerId,
      customerName: payload.customerName || 'Client Guest',
      customerPhone: payload.customerPhone || '+91 98765 00000',
      customerEmail: null,
      staffId: payload.staffId,
      staffName: payload.staffId === 'st-1' ? 'Aarav Mehta' : 'Pooja Hegde',
      staffRole: 'Certified Stylist',
      serviceId: payload.serviceId,
      serviceName: 'Custom Salon Service',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'BOOKED',
      isWalkIn: payload.source === 'WALK_IN',
      queueToken: null,
      queueStatus: null,
      checkedInAt: null,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      bufferMinutes: buffer,
      totalDurationMinutes: duration,
      subtotal,
      taxAmount,
      totalAmount,
      source: payload.source || 'FRONT_DESK',
      paymentStatus: 'PENDING',
      notes: payload.notes || null,
      clientPreferences: payload.clientPreferences || null,
      chairNumber: 'Chair #2',
      services: [
        {
          serviceId: payload.serviceId,
          serviceName: 'Custom Salon Service',
          staffId: payload.staffId,
          sequenceOrder: 1,
          durationMinutes: duration,
          bufferMinutes: buffer,
          price: subtotal,
          taxRate: 18,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        },
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          appointmentId: id,
          type: 'CONFIRMATION',
          channel: 'SMS',
          recipient: payload.customerPhone || '+91 98765 00000',
          message: `Your appointment ${appointmentNumber} is booked for ${start.toLocaleDateString()} at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
          status: 'SENT',
          sentAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.appointmentsDb.set(id, newApt);
    return newApt;
  }

  /**
   * Create Walk-in with instant token and queue assignment
   */
  async createWalkIn(organizationId: string, payload: CreateWalkInDto): Promise<AppointmentItem> {
    const token = `W-${String(this.queueCounter++).padStart(2, '0')}`;
    const start = new Date();
    const duration = 45;
    const end = new Date(start.getTime() + duration * 60000);
    const dateStr = start.toISOString().split('T')[0].replace(/-/g, '');
    const appointmentNumber = `APT-${dateStr}-${token}`;

    const id = `apt-w-${Date.now()}`;
    const subtotal = 750;
    const taxAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + taxAmount;

    const walkInApt: AppointmentItem = {
      id,
      appointmentNumber,
      organizationId,
      branchId: payload.branchId,
      branchName: payload.branchId === 'br-jubilee' ? 'Jubilee Hills Flagship' : 'Banjara Hills Premium',
      customerId: `c-guest-${Date.now()}`,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail || null,
      staffId: payload.staffId || 'st-3',
      staffName: payload.staffId ? 'Assigned Stylist' : 'First Available Stylist',
      serviceId: payload.serviceId,
      serviceName: 'Walk-in Express Service',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'ARRIVED',
      isWalkIn: true,
      queueToken: token,
      queueStatus: 'WAITING',
      checkedInAt: start.toISOString(),
      serviceStartedAt: null,
      serviceCompletedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      bufferMinutes: 15,
      totalDurationMinutes: duration,
      subtotal,
      taxAmount,
      totalAmount,
      source: 'WALK_IN',
      paymentStatus: 'PENDING',
      notes: payload.notes || 'Walk-in client queue entry',
      clientPreferences: payload.clientPreferences || null,
      chairNumber: 'Lounge Waiting Area',
      services: [],
      notifications: [],
      createdAt: start.toISOString(),
      updatedAt: start.toISOString(),
    };

    this.appointmentsDb.set(id, walkInApt);
    return walkInApt;
  }

  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(
    organizationId: string,
    id: string,
    payload: RescheduleAppointmentDto
  ): Promise<AppointmentItem> {
    const apt = await this.getAppointmentById(organizationId, id);

    const newStaffId = payload.staffId || apt.staffId;
    const newBranchId = payload.branchId || apt.branchId;

    // Check collision for new slot
    const collision = await this.checkCollision(
      organizationId,
      newStaffId,
      newBranchId,
      payload.startTime,
      apt.totalDurationMinutes,
      apt.bufferMinutes,
      id
    );

    if (collision.hasConflict) {
      throw new ConflictException(collision.message);
    }

    const start = new Date(payload.startTime);
    const end = new Date(start.getTime() + apt.totalDurationMinutes * 60000);

    apt.startTime = start.toISOString();
    apt.endTime = end.toISOString();
    apt.staffId = newStaffId;
    apt.branchId = newBranchId;
    apt.status = 'CONFIRMED';
    apt.updatedAt = new Date().toISOString();

    if (apt.notifications) {
      apt.notifications.push({
        id: `notif-${Date.now()}`,
        appointmentId: id,
        type: 'RESCHEDULE',
        channel: 'SMS',
        recipient: apt.customerPhone,
        message: `Your appointment ${apt.appointmentNumber} has been rescheduled to ${start.toLocaleDateString()} at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        status: 'SENT',
        sentAt: new Date().toISOString(),
      });
    }

    this.appointmentsDb.set(id, apt);
    return apt;
  }

  /**
   * Customer Check-In (Mark Arrived)
   */
  async checkInCustomer(organizationId: string, payload: CheckInDto): Promise<AppointmentItem> {
    const apt = await this.getAppointmentById(organizationId, payload.appointmentId);
    apt.status = 'ARRIVED';
    apt.checkedInAt = new Date().toISOString();
    if (payload.chairNumber) {
      apt.chairNumber = payload.chairNumber;
    }
    if (apt.isWalkIn) {
      apt.queueStatus = 'WAITING';
    }
    apt.updatedAt = new Date().toISOString();
    this.appointmentsDb.set(payload.appointmentId, apt);
    return apt;
  }

  /**
   * Update Appointment Status
   */
  async updateStatus(
    organizationId: string,
    id: string,
    status: AppointmentStatus,
    cancellationReason?: string
  ): Promise<AppointmentItem> {
    const apt = await this.getAppointmentById(organizationId, id);
    apt.status = status;
    apt.updatedAt = new Date().toISOString();

    if (status === 'IN_PROGRESS') {
      apt.serviceStartedAt = new Date().toISOString();
      if (apt.queueStatus) apt.queueStatus = 'IN_SERVICE';
    } else if (status === 'COMPLETED') {
      apt.serviceCompletedAt = new Date().toISOString();
      if (apt.queueStatus) apt.queueStatus = 'COMPLETED';
    } else if (status === 'CANCELLED') {
      apt.cancelledAt = new Date().toISOString();
      apt.cancellationReason = cancellationReason || 'Customer requested cancellation';
      if (apt.queueStatus) apt.queueStatus = 'CANCELLED';
    }

    this.appointmentsDb.set(id, apt);
    return apt;
  }

  /**
   * Live Walk-in Queue
   */
  async getLiveQueue(organizationId: string, branchId?: string): Promise<QueueTicketItem[]> {
    const list = Array.from(this.appointmentsDb.values()).filter((a) => {
      if (a.organizationId !== organizationId) return false;
      if (branchId && branchId !== 'all' && a.branchId !== branchId) return false;
      return a.queueStatus && a.queueStatus !== 'CANCELLED';
    });

    return list.map((a, idx) => ({
      id: `queue-${a.id}`,
      appointmentId: a.id,
      tokenNumber: a.queueToken || `W-${String(idx + 1).padStart(2, '0')}`,
      customerName: a.customerName,
      customerPhone: a.customerPhone,
      serviceName: a.serviceName,
      staffName: a.staffName,
      branchId: a.branchId,
      branchName: a.branchName || 'Branch',
      status: (a.queueStatus as QueueStatus) || 'WAITING',
      waitStartTime: a.checkedInAt || a.createdAt,
      estimatedWaitMinutes: Math.max(5, 15 * (idx + 1)),
      calledAt: a.serviceStartedAt ? new Date(new Date(a.serviceStartedAt).getTime() - 300000).toISOString() : null,
      serviceStartedAt: a.serviceStartedAt,
      notes: a.notes,
    }));
  }

  /**
   * Transition Live Queue Stage
   */
  async transitionQueueStage(
    organizationId: string,
    appointmentId: string,
    newStatus: QueueStatus,
    chairNumber?: string
  ): Promise<AppointmentItem> {
    const apt = await this.getAppointmentById(organizationId, appointmentId);
    apt.queueStatus = newStatus;
    if (chairNumber) apt.chairNumber = chairNumber;

    if (newStatus === 'CALLED') {
      apt.status = 'ARRIVED';
    } else if (newStatus === 'IN_SERVICE') {
      apt.status = 'IN_PROGRESS';
      apt.serviceStartedAt = new Date().toISOString();
    } else if (newStatus === 'COMPLETED') {
      apt.status = 'COMPLETED';
      apt.serviceCompletedAt = new Date().toISOString();
    } else if (newStatus === 'CANCELLED') {
      apt.status = 'CANCELLED';
      apt.cancelledAt = new Date().toISOString();
    }

    apt.updatedAt = new Date().toISOString();
    this.appointmentsDb.set(appointmentId, apt);
    return apt;
  }
}
