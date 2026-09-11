import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import type {
  StaffMemberDetail,
  CreateStaffDto,
  UpdateStaffDto,
  ShiftTemplateDetail,
  CreateShiftTemplateDto,
  StaffRosterDetail,
  RosterAssignmentPayload,
  AttendanceRecordDetail,
  AttendancePunchPayload,
  ManualAttendancePayload,
  LeaveRequestDetail,
  ApplyLeavePayload,
  ReviewLeavePayload,
  LeaveBalanceDetail,
  StaffDashboardSummary,
  StaffManagerOverview,
  StaffRoleType,
  StaffStatus,
  AttendanceStatus,
} from '@hive/types';

@Injectable()
export class StaffService {
  private staffDb = new Map<string, StaffMemberDetail>();
  private shiftTemplatesDb = new Map<string, ShiftTemplateDetail>();
  private rosterDb: StaffRosterDetail[] = [];
  private attendanceDb: AttendanceRecordDetail[] = [];
  private leaveRequestsDb = new Map<string, LeaveRequestDetail>();
  private leaveBalancesDb = new Map<string, LeaveBalanceDetail>();

  private branchNames: Record<string, { name: string; code: string }> = {
    'br-jubilee': { name: 'Jubilee Hills Flagship', code: 'HYD-JUB' },
    'br-banjara': { name: 'Banjara Hills Spa & Lounge', code: 'HYD-BAN' },
    'br-hitech': { name: 'Hitech City Express', code: 'HYD-HIT' },
    'br-indiranagar': { name: 'Indiranagar Sanctuary', code: 'BLR-IND' },
  };

  constructor() {
    this.seedInitialStaffData();
  }

  // ---------------------------------------------------------------------------
  // 1. SEED DATA INITIALIZATION
  // ---------------------------------------------------------------------------
  private seedInitialStaffData() {
    const orgId = 'org_hive_demo';
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // 1. Seed Shift Templates
    const shiftTemplates: ShiftTemplateDetail[] = [
      {
        id: 'shift-morn',
        organizationId: orgId,
        name: 'Morning Shift',
        code: 'MORN',
        startTime: '09:00',
        endTime: '18:00',
        breakDurationMinutes: 60,
        color: '#d97706',
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'shift-even',
        organizationId: orgId,
        name: 'Evening Shift',
        code: 'EVEN',
        startTime: '12:00',
        endTime: '21:00',
        breakDurationMinutes: 60,
        color: '#8b5cf6',
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'shift-full',
        organizationId: orgId,
        name: 'Full Day Weekend Rush',
        code: 'FULL',
        startTime: '10:00',
        endTime: '20:00',
        breakDurationMinutes: 60,
        color: '#0ea5e9',
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'shift-split',
        organizationId: orgId,
        name: 'Split Shift',
        code: 'SPLIT',
        startTime: '10:00',
        endTime: '21:00',
        breakDurationMinutes: 180,
        color: '#10b981',
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    shiftTemplates.forEach((st) => this.shiftTemplatesDb.set(st.id, st));

    // 2. Seed Staff Members across all 10 Roles
    const staffMembers: StaffMemberDetail[] = [
      {
        id: 'st-1',
        organizationId: orgId,
        userId: 'usr-aarav',
        employeeCode: 'EMP-HYD-001',
        displayName: 'Aarav Mehta',
        fullName: 'Aarav Mehta',
        jobTitle: 'Master Stylist & Creative Director',
        staffType: 'STYLIST',
        phone: '+91 98765 01001',
        email: 'aarav.mehta@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2023-04-15',
        specialization: ['Balayage & Color Formulation', 'Precision Sassoon Cutting', 'Keratin Smoothing'],
        skills: ['Balayage', 'Highlights', 'Layered Cut', 'Keratin', 'Blowdry'],
        assignedServiceIds: ['srv-1', 'srv-2', 'srv-3'],
        assignedServiceNames: ['Signature Precision Haircut', 'Balayage & Multi-Dimensional Glaze', 'Keratin Smoothing Therapy'],
        commissionType: 'PERCENTAGE',
        commissionRate: 15,
        monthlyRevenueTarget: 180000,
        monthlyServiceTarget: 70,
        achievedMonthlyRevenue: 142500,
        achievedMonthlyServices: 54,
        isAvailableForBooking: true,
        status: 'ACTIVE',
        primaryBranchId: 'br-jubilee',
        primaryBranchName: 'Jubilee Hills Flagship',
        assignedBranchIds: ['br-jubilee', 'br-banjara'],
        assignedBranchNames: ['Jubilee Hills Flagship', 'Banjara Hills Spa & Lounge'],
        todayShift: 'Morning Shift (09:00 - 18:00)',
        todayAttendanceStatus: 'PRESENT',
        todayCheckInTime: `${todayStr}T09:12:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'st-2',
        organizationId: orgId,
        userId: 'usr-pooja',
        employeeCode: 'EMP-HYD-002',
        displayName: 'Pooja Hegde',
        fullName: 'Pooja Hegde',
        jobTitle: 'Senior Colorist & Hairdresser',
        staffType: 'HAIRDRESSER',
        phone: '+91 98765 01002',
        email: 'pooja.hegde@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2023-08-01',
        specialization: ['Global Color Tinting', 'Ammonia-Free Bleach', 'Gloss Toning'],
        skills: ['Majirel Color', 'Root Touchup', 'Hair Botox', 'Deep Conditioning'],
        assignedServiceIds: ['srv-2', 'srv-3'],
        assignedServiceNames: ['Balayage & Multi-Dimensional Glaze', 'Keratin Smoothing Therapy'],
        commissionType: 'PERCENTAGE',
        commissionRate: 15,
        monthlyRevenueTarget: 150000,
        monthlyServiceTarget: 60,
        achievedMonthlyRevenue: 118400,
        achievedMonthlyServices: 46,
        isAvailableForBooking: true,
        status: 'ACTIVE',
        primaryBranchId: 'br-jubilee',
        primaryBranchName: 'Jubilee Hills Flagship',
        assignedBranchIds: ['br-jubilee'],
        assignedBranchNames: ['Jubilee Hills Flagship'],
        todayShift: 'Morning Shift (09:00 - 18:00)',
        todayAttendanceStatus: 'LATE',
        todayCheckInTime: `${todayStr}T09:48:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'st-3',
        organizationId: orgId,
        userId: 'usr-vikram',
        employeeCode: 'EMP-HYD-003',
        displayName: 'Vikram Sethi',
        fullName: 'Vikram Sethi',
        jobTitle: 'Senior Barber & Grooming Specialist',
        staffType: 'STYLIST',
        phone: '+91 98765 01003',
        email: 'vikram.sethi@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2024-01-10',
        specialization: ['Skin Fade', 'Beard Styling & Hot Towel Shave', 'Scalp Detox'],
        skills: ['Barbering', 'Beard Trim', 'Head Massage', 'Razor Fade'],
        assignedServiceIds: ['srv-1'],
        assignedServiceNames: ['Signature Precision Haircut'],
        commissionType: 'PERCENTAGE',
        commissionRate: 12,
        monthlyRevenueTarget: 120000,
        monthlyServiceTarget: 80,
        achievedMonthlyRevenue: 95200,
        achievedMonthlyServices: 62,
        isAvailableForBooking: true,
        status: 'ACTIVE',
        primaryBranchId: 'br-hitech',
        primaryBranchName: 'Hitech City Express',
        assignedBranchIds: ['br-hitech', 'br-jubilee'],
        assignedBranchNames: ['Hitech City Express', 'Jubilee Hills Flagship'],
        todayShift: 'Morning Shift (09:00 - 18:00)',
        todayAttendanceStatus: 'PRESENT',
        todayCheckInTime: `${todayStr}T08:58:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'st-4',
        organizationId: orgId,
        userId: 'usr-ananya',
        employeeCode: 'EMP-HYD-004',
        displayName: 'Ananya Roy',
        fullName: 'Ananya Roy',
        jobTitle: 'Lead Aesthetician & Beautician',
        staffType: 'BEAUTICIAN',
        phone: '+91 98765 01004',
        email: 'ananya.roy@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2023-11-20',
        specialization: ['Clinical Hydrafacial', 'Chemical Exfoliation', 'Dermaplaning'],
        skills: ['Hydrafacial', 'Extraction', 'Lymphatic Drainage', 'Algae Mask'],
        assignedServiceIds: ['srv-facial-1'],
        assignedServiceNames: ['Hydra-Dew Glow Facial & Extraction'],
        commissionType: 'PERCENTAGE',
        commissionRate: 15,
        monthlyRevenueTarget: 160000,
        monthlyServiceTarget: 50,
        achievedMonthlyRevenue: 135000,
        achievedMonthlyServices: 42,
        isAvailableForBooking: true,
        status: 'ACTIVE',
        primaryBranchId: 'br-banjara',
        primaryBranchName: 'Banjara Hills Spa & Lounge',
        assignedBranchIds: ['br-banjara', 'br-jubilee'],
        assignedBranchNames: ['Banjara Hills Spa & Lounge', 'Jubilee Hills Flagship'],
        todayShift: 'Evening Shift (12:00 - 21:00)',
        todayAttendanceStatus: 'PRESENT',
        todayCheckInTime: `${todayStr}T11:55:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'st-5',
        organizationId: orgId,
        userId: 'usr-david',
        employeeCode: 'EMP-BLR-005',
        displayName: 'David Jones',
        fullName: 'David Jones',
        jobTitle: 'Senior Spa & Wellness Therapist',
        staffType: 'THERAPIST',
        phone: '+91 98765 01005',
        email: 'david.jones@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2024-02-01',
        specialization: ['Swedish Aromatherapy', 'Deep Tissue Trigger Point', 'Balinese Massage'],
        skills: ['Full Body Massage', 'Aromatherapy Oils', 'Foot Reflexology'],
        assignedServiceIds: ['srv-spa-1'],
        assignedServiceNames: ['Swedish Aromatherapy Full Body Massage 60m'],
        commissionType: 'PERCENTAGE',
        commissionRate: 18,
        monthlyRevenueTarget: 140000,
        monthlyServiceTarget: 45,
        achievedMonthlyRevenue: 110500,
        achievedMonthlyServices: 36,
        isAvailableForBooking: true,
        status: 'ACTIVE',
        primaryBranchId: 'br-indiranagar',
        primaryBranchName: 'Indiranagar Sanctuary',
        assignedBranchIds: ['br-indiranagar'],
        assignedBranchNames: ['Indiranagar Sanctuary'],
        todayShift: 'Full Day Weekend Rush (10:00 - 20:00)',
        todayAttendanceStatus: 'PRESENT',
        todayCheckInTime: `${todayStr}T09:50:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'st-6',
        organizationId: orgId,
        userId: 'usr-meera',
        employeeCode: 'EMP-HYD-006',
        displayName: 'Meera Nambiar',
        fullName: 'Meera Nambiar',
        jobTitle: 'Senior Nail Artist & Extensionist',
        staffType: 'NAIL_ARTIST',
        phone: '+91 98765 01006',
        email: 'meera.nambiar@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2024-03-15',
        specialization: ['Gel Extensions & French Ombre', '3D Chrome Art', 'Russian Manicure'],
        skills: ['Gel Overlay', 'Nail Art', 'Cuticle Care', 'Acrylic Refill'],
        assignedServiceIds: [],
        commissionType: 'PERCENTAGE',
        commissionRate: 14,
        monthlyRevenueTarget: 90000,
        monthlyServiceTarget: 50,
        achievedMonthlyRevenue: 78200,
        achievedMonthlyServices: 44,
        isAvailableForBooking: true,
        status: 'ACTIVE',
        primaryBranchId: 'br-jubilee',
        primaryBranchName: 'Jubilee Hills Flagship',
        assignedBranchIds: ['br-jubilee'],
        assignedBranchNames: ['Jubilee Hills Flagship'],
        todayShift: 'Morning Shift (09:00 - 18:00)',
        todayAttendanceStatus: 'PRESENT',
        todayCheckInTime: `${todayStr}T09:05:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'st-7',
        organizationId: orgId,
        userId: 'usr-neha',
        employeeCode: 'EMP-HYD-007',
        displayName: 'Neha Kapoor',
        fullName: 'Neha Kapoor',
        jobTitle: 'Celebrity Makeup Artist & Microblading Specialist',
        staffType: 'MAKEUP_ARTIST',
        phone: '+91 98765 01007',
        email: 'neha.kapoor@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2023-05-10',
        specialization: ['Bridal HD Airbrush', 'Editorial Glam', 'Microblading Eyebrows'],
        skills: ['Airbrush Makeup', 'Eyelash Extensions', 'Contouring', 'Microblading'],
        assignedServiceIds: [],
        commissionType: 'PERCENTAGE',
        commissionRate: 20,
        monthlyRevenueTarget: 200000,
        monthlyServiceTarget: 30,
        achievedMonthlyRevenue: 165000,
        achievedMonthlyServices: 24,
        isAvailableForBooking: true,
        status: 'ACTIVE',
        primaryBranchId: 'br-banjara',
        primaryBranchName: 'Banjara Hills Spa & Lounge',
        assignedBranchIds: ['br-banjara', 'br-jubilee'],
        assignedBranchNames: ['Banjara Hills Spa & Lounge', 'Jubilee Hills Flagship'],
        todayShift: 'Evening Shift (12:00 - 21:00)',
        todayAttendanceStatus: 'PRESENT',
        todayCheckInTime: `${todayStr}T11:45:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'st-8',
        organizationId: orgId,
        userId: 'usr-rohan',
        employeeCode: 'EMP-HYD-008',
        displayName: 'Rohan Varma',
        fullName: 'Rohan Varma',
        jobTitle: 'Front Desk Lead & Operations In-Charge',
        staffType: 'FRONT_DESK',
        phone: '+91 98765 01008',
        email: 'rohan.varma@hivesalon.in',
        avatarUrl: null,
        joiningDate: '2023-02-01',
        specialization: ['Client Concierge', 'Multi-Branch Booking', 'Billing & POS'],
        skills: ['POS Operations', 'Client Communication', 'Queue Management'],
        assignedServiceIds: [],
        commissionType: 'FIXED',
        commissionRate: 0,
        monthlyRevenueTarget: 0,
        monthlyServiceTarget: 0,
        achievedMonthlyRevenue: 0,
        achievedMonthlyServices: 0,
        isAvailableForBooking: false,
        status: 'ACTIVE',
        primaryBranchId: 'br-jubilee',
        primaryBranchName: 'Jubilee Hills Flagship',
        assignedBranchIds: ['br-jubilee'],
        assignedBranchNames: ['Jubilee Hills Flagship'],
        todayShift: 'Morning Shift (09:00 - 18:00)',
        todayAttendanceStatus: 'PRESENT',
        todayCheckInTime: `${todayStr}T08:45:00.000Z`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    staffMembers.forEach((sm) => {
      this.staffDb.set(sm.id, sm);

      // Seed Leave Balance
      this.leaveBalancesDb.set(sm.id, {
        staffId: sm.id,
        staffName: sm.displayName,
        year: 2026,
        casualLeave: { total: 12, used: 2, available: 10 },
        sickLeave: { total: 8, used: 1, available: 7 },
        earnedLeave: { total: 15, used: 4, available: 11 },
        totalAvailable: 28,
      });

      // Seed Today Attendance
      const attRecord: AttendanceRecordDetail = {
        id: `att-${todayStr}-${sm.id}`,
        organizationId: orgId,
        branchId: sm.primaryBranchId || 'br-jubilee',
        branchName: sm.primaryBranchName || 'Jubilee Hills Flagship',
        staffId: sm.id,
        staffName: sm.displayName,
        staffCode: sm.employeeCode,
        staffType: sm.staffType,
        date: todayStr,
        checkInTime: sm.todayCheckInTime || `${todayStr}T09:00:00.000Z`,
        checkOutTime: null,
        status: sm.todayAttendanceStatus || 'PRESENT',
        checkInMethod: 'WEB_PORTAL',
        lateMinutes: sm.todayAttendanceStatus === 'LATE' ? 48 : 0,
        earlyExitMinutes: 0,
        overtimeMinutes: 0,
        totalWorkingHours: 2.8,
        breakMinutes: 0,
        isOnBreak: sm.id === 'st-5',
        breakStartTime: sm.id === 'st-5' ? `${todayStr}T11:30:00.000Z` : null,
        biometricDeviceId: 'BIO-HYD-01',
        biometricSyncToken: 'SYNC-9982-HASH',
        notes: sm.todayAttendanceStatus === 'LATE' ? 'Heavy traffic on Jubilee Hills Checkpost' : 'Normal punch',
        approvedByName: 'Sarah Jenkins',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      this.attendanceDb.push(attRecord);
    });

    // 3. Seed Weekly Roster Schedules
    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    daysOfWeek.forEach((day, idx) => {
      const scheduleDate = new Date(now.getTime() + (idx - now.getDay() + 1) * 86400000)
        .toISOString()
        .split('T')[0];

      staffMembers.forEach((sm) => {
        const isOff = (sm.id === 'st-1' && day === 'TUESDAY') || (sm.id === 'st-2' && day === 'MONDAY');
        const shift = shiftTemplates[idx % shiftTemplates.length];

        this.rosterDb.push({
          id: `ros-${scheduleDate}-${sm.id}`,
          organizationId: orgId,
          branchId: sm.primaryBranchId || 'br-jubilee',
          branchName: sm.primaryBranchName || 'Jubilee Hills Flagship',
          staffId: sm.id,
          staffName: sm.displayName,
          staffCode: sm.employeeCode,
          staffType: sm.staffType,
          shiftTemplateId: isOff ? null : shift.id,
          shiftName: isOff ? 'Weekly Off' : shift.name,
          shiftCode: isOff ? 'OFF' : shift.code,
          shiftColor: isOff ? '#94a3b8' : shift.color,
          date: scheduleDate,
          dayOfWeek: day,
          startTime: isOff ? null : shift.startTime,
          endTime: isOff ? null : shift.endTime,
          isOffDay: isOff,
          isHoliday: false,
          notes: isOff ? 'Scheduled weekly off day' : null,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        });
      });
    });

    // 4. Seed Leave Requests
    const leave1: LeaveRequestDetail = {
      id: 'leave-001',
      organizationId: orgId,
      branchId: 'br-jubilee',
      branchName: 'Jubilee Hills Flagship',
      staffId: 'st-1',
      staffName: 'Aarav Mehta',
      staffCode: 'EMP-HYD-001',
      staffType: 'STYLIST',
      leaveType: 'CASUAL_LEAVE',
      startDate: new Date(now.getTime() + 5 * 86400000).toISOString().split('T')[0],
      endDate: new Date(now.getTime() + 6 * 86400000).toISOString().split('T')[0],
      totalDays: 2,
      isHalfDay: false,
      reason: 'Attending family wedding ceremony out of town.',
      status: 'PENDING',
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    };

    const leave2: LeaveRequestDetail = {
      id: 'leave-002',
      organizationId: orgId,
      branchId: 'br-banjara',
      branchName: 'Banjara Hills Spa & Lounge',
      staffId: 'st-4',
      staffName: 'Ananya Roy',
      staffCode: 'EMP-HYD-004',
      staffType: 'BEAUTICIAN',
      leaveType: 'EARNED_LEAVE',
      startDate: new Date(now.getTime() + 12 * 86400000).toISOString().split('T')[0],
      endDate: new Date(now.getTime() + 15 * 86400000).toISOString().split('T')[0],
      totalDays: 4,
      isHalfDay: false,
      reason: 'Annual personal vacation.',
      status: 'APPROVED',
      reviewedByName: 'Sarah Jenkins (Branch Manager)',
      reviewedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      reviewNotes: 'Approved. Advance booking slots blocked.',
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    };

    this.leaveRequestsDb.set(leave1.id, leave1);
    this.leaveRequestsDb.set(leave2.id, leave2);
  }

  // ---------------------------------------------------------------------------
  // 2. STAFF PROFILES CRUD
  // ---------------------------------------------------------------------------
  async getAllStaff(filters?: {
    branchId?: string;
    staffType?: string;
    status?: string;
    search?: string;
  }): Promise<StaffMemberDetail[]> {
    let list = Array.from(this.staffDb.values());

    if (filters?.branchId && filters.branchId !== 'ALL') {
      list = list.filter((s) => s.assignedBranchIds.includes(filters.branchId!));
    }
    if (filters?.staffType) {
      list = list.filter((s) => s.staffType === filters.staffType);
    }
    if (filters?.status) {
      list = list.filter((s) => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.displayName.toLowerCase().includes(q) ||
          s.employeeCode.toLowerCase().includes(q) ||
          s.jobTitle.toLowerCase().includes(q) ||
          s.skills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    return list;
  }

  async getStaffById(id: string): Promise<StaffMemberDetail> {
    const staff = this.staffDb.get(id);
    if (!staff) throw new NotFoundException(`Staff member ${id} not found.`);
    return staff;
  }

  async createStaff(dto: CreateStaffDto, orgId = 'org_hive_demo'): Promise<StaffMemberDetail> {
    for (const s of this.staffDb.values()) {
      if (s.employeeCode.toLowerCase() === dto.employeeCode.toLowerCase()) {
        throw new ConflictException(`Employee code "${dto.employeeCode}" already assigned.`);
      }
    }

    const now = new Date().toISOString();
    const id = `st-${Date.now()}`;
    const branchInfo = dto.primaryBranchId
      ? this.branchNames[dto.primaryBranchId]
      : { name: 'Jubilee Hills Flagship', code: 'HYD-JUB' };

    const newStaff: StaffMemberDetail = {
      id,
      organizationId: orgId,
      userId: `usr-${Date.now()}`,
      employeeCode: dto.employeeCode.toUpperCase(),
      displayName: dto.displayName,
      fullName: dto.displayName,
      jobTitle: dto.jobTitle,
      staffType: dto.staffType,
      phone: dto.phone || null,
      email: dto.email || null,
      joiningDate: dto.joiningDate || now.split('T')[0],
      specialization: dto.specialization || [],
      skills: dto.skills || [],
      assignedServiceIds: dto.assignedServiceIds || [],
      commissionType: dto.commissionType || 'PERCENTAGE',
      commissionRate: dto.commissionRate ?? 15,
      monthlyRevenueTarget: dto.monthlyRevenueTarget ?? 100000,
      monthlyServiceTarget: dto.monthlyServiceTarget ?? 60,
      achievedMonthlyRevenue: 0,
      achievedMonthlyServices: 0,
      isAvailableForBooking: dto.isAvailableForBooking ?? true,
      status: 'ACTIVE',
      primaryBranchId: dto.primaryBranchId || 'br-jubilee',
      primaryBranchName: branchInfo?.name || 'Jubilee Hills Flagship',
      assignedBranchIds: dto.assignedBranchIds || [dto.primaryBranchId || 'br-jubilee'],
      assignedBranchNames: [branchInfo?.name || 'Jubilee Hills Flagship'],
      createdAt: now,
      updatedAt: now,
    };

    this.staffDb.set(id, newStaff);

    // Initialize Leave Balance
    this.leaveBalancesDb.set(id, {
      staffId: id,
      staffName: newStaff.displayName,
      year: new Date().getFullYear(),
      casualLeave: { total: 12, used: 0, available: 12 },
      sickLeave: { total: 8, used: 0, available: 8 },
      earnedLeave: { total: 15, used: 0, available: 15 },
      totalAvailable: 35,
    });

    return newStaff;
  }

  async updateStaff(id: string, dto: UpdateStaffDto): Promise<StaffMemberDetail> {
    const existing = await this.getStaffById(id);
    const updated: StaffMemberDetail = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.staffDb.set(id, updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // 3. SHIFT TEMPLATES & ROSTERS
  // ---------------------------------------------------------------------------
  async getShiftTemplates(): Promise<ShiftTemplateDetail[]> {
    return Array.from(this.shiftTemplatesDb.values());
  }

  async createShiftTemplate(dto: CreateShiftTemplateDto, orgId = 'org_hive_demo'): Promise<ShiftTemplateDetail> {
    const now = new Date().toISOString();
    const id = `shift-${Date.now()}`;
    const newShift: ShiftTemplateDetail = {
      id,
      organizationId: orgId,
      branchId: dto.branchId || null,
      name: dto.name,
      code: dto.code.toUpperCase(),
      startTime: dto.startTime,
      endTime: dto.endTime,
      breakDurationMinutes: dto.breakDurationMinutes ?? 60,
      color: dto.color || '#d97706',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.shiftTemplatesDb.set(id, newShift);
    return newShift;
  }

  async getRosterSchedule(branchId?: string, startDate?: string): Promise<StaffRosterDetail[]> {
    let list = [...this.rosterDb];
    if (branchId && branchId !== 'ALL') {
      list = list.filter((r) => r.branchId === branchId);
    }
    return list;
  }

  async assignRosterShift(payload: RosterAssignmentPayload, orgId = 'org_hive_demo'): Promise<StaffRosterDetail> {
    const staff = await this.getStaffById(payload.staffId);
    const branchInfo = this.branchNames[payload.branchId] || { name: 'Main Branch', code: 'BR' };
    const shift = payload.shiftTemplateId ? this.shiftTemplatesDb.get(payload.shiftTemplateId) : null;
    const now = new Date().toISOString();

    const dateObj = new Date(payload.date);
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayOfWeek = days[dateObj.getDay()];

    const rosterItem: StaffRosterDetail = {
      id: `ros-${payload.date}-${staff.id}`,
      organizationId: orgId,
      branchId: payload.branchId,
      branchName: branchInfo.name,
      staffId: staff.id,
      staffName: staff.displayName,
      staffCode: staff.employeeCode,
      staffType: staff.staffType,
      shiftTemplateId: payload.shiftTemplateId || null,
      shiftName: payload.isOffDay ? 'Weekly Off' : shift?.name || 'Standard Shift',
      shiftCode: payload.isOffDay ? 'OFF' : shift?.code || 'STD',
      shiftColor: payload.isOffDay ? '#94a3b8' : shift?.color || '#d97706',
      date: payload.date,
      dayOfWeek,
      startTime: payload.isOffDay ? null : shift?.startTime || '09:00',
      endTime: payload.isOffDay ? null : shift?.endTime || '18:00',
      isOffDay: payload.isOffDay ?? false,
      isHoliday: false,
      notes: payload.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    // Replace if exists
    const idx = this.rosterDb.findIndex((r) => r.staffId === payload.staffId && r.date === payload.date);
    if (idx >= 0) this.rosterDb[idx] = rosterItem;
    else this.rosterDb.push(rosterItem);

    return rosterItem;
  }

  // ---------------------------------------------------------------------------
  // 4. ATTENDANCE ENGINE (1-Click Punch & Biometrics)
  // ---------------------------------------------------------------------------
  async punchAttendance(payload: AttendancePunchPayload, orgId = 'org_hive_demo'): Promise<AttendanceRecordDetail> {
    const staff = await this.getStaffById(payload.staffId);
    const branchInfo = this.branchNames[payload.branchId] || { name: 'Main Branch', code: 'BR' };
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let record = this.attendanceDb.find(
      (a) => a.staffId === payload.staffId && a.date === todayStr
    );

    if (!record) {
      record = {
        id: `att-${todayStr}-${staff.id}`,
        organizationId: orgId,
        branchId: payload.branchId,
        branchName: branchInfo.name,
        staffId: staff.id,
        staffName: staff.displayName,
        staffCode: staff.employeeCode,
        staffType: staff.staffType,
        date: todayStr,
        checkInTime: null,
        checkOutTime: null,
        status: 'PRESENT',
        checkInMethod: payload.method || 'WEB_PORTAL',
        lateMinutes: 0,
        earlyExitMinutes: 0,
        overtimeMinutes: 0,
        totalWorkingHours: 0,
        breakMinutes: 0,
        isOnBreak: false,
        breakStartTime: null,
        biometricDeviceId: payload.biometricDeviceId || null,
        notes: payload.notes || null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      this.attendanceDb.unshift(record);
    }

    if (payload.action === 'CHECK_IN') {
      record.checkInTime = now.toISOString();
      record.checkInMethod = payload.method || 'WEB_PORTAL';

      // Check if late (e.g. shift starts at 09:00, grace 15 mins)
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const totalMinutes = currentHours * 60 + currentMinutes;
      const shiftStartMinutes = 9 * 60; // 09:00 AM

      if (totalMinutes > shiftStartMinutes + 15) {
        record.status = 'LATE';
        record.lateMinutes = totalMinutes - shiftStartMinutes;
      } else {
        record.status = 'PRESENT';
        record.lateMinutes = 0;
      }

      staff.todayAttendanceStatus = record.status;
      staff.todayCheckInTime = record.checkInTime;
    } else if (payload.action === 'START_BREAK') {
      record.isOnBreak = true;
      record.breakStartTime = now.toISOString();
    } else if (payload.action === 'END_BREAK') {
      if (record.breakStartTime) {
        const breakMins = Math.round((now.getTime() - new Date(record.breakStartTime).getTime()) / 60000);
        record.breakMinutes += breakMins;
      }
      record.isOnBreak = false;
      record.breakStartTime = null;
    } else if (payload.action === 'CHECK_OUT') {
      record.checkOutTime = now.toISOString();
      record.isOnBreak = false;

      if (record.checkInTime) {
        const diffMs = now.getTime() - new Date(record.checkInTime).getTime();
        const diffMins = Math.round(diffMs / 60000) - record.breakMinutes;
        const totalHrs = Math.max(0, Math.round((diffMins / 60) * 100) / 100);
        record.totalWorkingHours = totalHrs;

        if (totalHrs > 9.0) {
          record.status = 'OVERTIME';
          record.overtimeMinutes = Math.round((totalHrs - 9.0) * 60);
        }
      }
    }

    record.updatedAt = now.toISOString();
    this.staffDb.set(staff.id, staff);
    return record;
  }

  async getAttendanceRecords(filters?: {
    branchId?: string;
    staffId?: string;
    date?: string;
  }): Promise<AttendanceRecordDetail[]> {
    let list = [...this.attendanceDb];
    if (filters?.branchId && filters.branchId !== 'ALL') {
      list = list.filter((a) => a.branchId === filters.branchId);
    }
    if (filters?.staffId) {
      list = list.filter((a) => a.staffId === filters.staffId);
    }
    if (filters?.date) {
      list = list.filter((a) => a.date === filters.date);
    }
    return list;
  }

  async recordManualAttendance(payload: ManualAttendancePayload, orgId = 'org_hive_demo'): Promise<AttendanceRecordDetail> {
    const staff = await this.getStaffById(payload.staffId);
    const branchInfo = this.branchNames[payload.branchId] || { name: 'Main Branch', code: 'BR' };
    const now = new Date().toISOString();

    const record: AttendanceRecordDetail = {
      id: `att-${payload.date}-${staff.id}`,
      organizationId: orgId,
      branchId: payload.branchId,
      branchName: branchInfo.name,
      staffId: staff.id,
      staffName: staff.displayName,
      staffCode: staff.employeeCode,
      staffType: staff.staffType,
      date: payload.date,
      checkInTime: payload.checkInTime || `${payload.date}T09:00:00.000Z`,
      checkOutTime: payload.checkOutTime || `${payload.date}T18:00:00.000Z`,
      status: payload.status,
      checkInMethod: 'MANUAL_MANAGER',
      lateMinutes: 0,
      earlyExitMinutes: 0,
      overtimeMinutes: 0,
      totalWorkingHours: 8.0,
      breakMinutes: 60,
      isOnBreak: false,
      notes: payload.notes,
      approvedByName: payload.performedByName || 'Manager Override',
      createdAt: now,
      updatedAt: now,
    };

    const idx = this.attendanceDb.findIndex((a) => a.staffId === payload.staffId && a.date === payload.date);
    if (idx >= 0) this.attendanceDb[idx] = record;
    else this.attendanceDb.unshift(record);

    return record;
  }

  // ---------------------------------------------------------------------------
  // 5. LEAVE REQUESTS & APPROVALS
  // ---------------------------------------------------------------------------
  async getAllLeaves(filters?: { branchId?: string; staffId?: string; status?: string }): Promise<LeaveRequestDetail[]> {
    let list = Array.from(this.leaveRequestsDb.values());
    if (filters?.branchId && filters.branchId !== 'ALL') {
      list = list.filter((l) => l.branchId === filters.branchId);
    }
    if (filters?.staffId) {
      list = list.filter((l) => l.staffId === filters.staffId);
    }
    if (filters?.status) {
      list = list.filter((l) => l.status === filters.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async applyLeave(payload: ApplyLeavePayload, orgId = 'org_hive_demo'): Promise<LeaveRequestDetail> {
    const staff = await this.getStaffById(payload.staffId);
    const branchInfo = this.branchNames[payload.branchId] || { name: 'Main Branch', code: 'BR' };
    const now = new Date().toISOString();
    const id = `leave-${Date.now()}`;

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);
    const daysDiff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
    const totalDays = payload.isHalfDay ? 0.5 : (payload.totalDays || daysDiff);

    const leaveRequest: LeaveRequestDetail = {
      id,
      organizationId: orgId,
      branchId: payload.branchId,
      branchName: branchInfo.name,
      staffId: staff.id,
      staffName: staff.displayName,
      staffCode: staff.employeeCode,
      staffType: staff.staffType,
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      totalDays,
      isHalfDay: payload.isHalfDay ?? false,
      reason: payload.reason,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    this.leaveRequestsDb.set(id, leaveRequest);
    return leaveRequest;
  }

  async reviewLeave(leaveId: string, payload: ReviewLeavePayload): Promise<LeaveRequestDetail> {
    const leave = this.leaveRequestsDb.get(leaveId);
    if (!leave) throw new NotFoundException(`Leave request ${leaveId} not found.`);

    const now = new Date().toISOString();

    if (payload.action === 'APPROVE') {
      leave.status = 'APPROVED';
      leave.reviewedByName = payload.reviewerName || 'Manager Reviewer';
      leave.reviewedAt = now;
      leave.reviewNotes = payload.reviewNotes || 'Leave approved.';

      // Deduct from Leave Balance
      const balance = this.leaveBalancesDb.get(leave.staffId);
      if (balance) {
        if (leave.leaveType === 'CASUAL_LEAVE') {
          balance.casualLeave.used += leave.totalDays;
          balance.casualLeave.available = Math.max(0, balance.casualLeave.total - balance.casualLeave.used);
        } else if (leave.leaveType === 'SICK_LEAVE') {
          balance.sickLeave.used += leave.totalDays;
          balance.sickLeave.available = Math.max(0, balance.sickLeave.total - balance.sickLeave.used);
        } else if (leave.leaveType === 'EARNED_LEAVE') {
          balance.earnedLeave.used += leave.totalDays;
          balance.earnedLeave.available = Math.max(0, balance.earnedLeave.total - balance.earnedLeave.used);
        }
        balance.totalAvailable =
          balance.casualLeave.available + balance.sickLeave.available + balance.earnedLeave.available;
      }
    } else if (payload.action === 'REJECT') {
      leave.status = 'REJECTED';
      leave.reviewedByName = payload.reviewerName || 'Manager Reviewer';
      leave.reviewedAt = now;
      leave.reviewNotes = payload.reviewNotes || 'Leave rejected due to high salon appointment volume.';
    } else if (payload.action === 'CANCEL') {
      leave.status = 'CANCELLED';
    }

    leave.updatedAt = now;
    this.leaveRequestsDb.set(leaveId, leave);
    return leave;
  }

  async getLeaveBalance(staffId: string): Promise<LeaveBalanceDetail> {
    const balance = this.leaveBalancesDb.get(staffId);
    if (!balance) {
      const staff = await this.getStaffById(staffId);
      return {
        staffId,
        staffName: staff.displayName,
        year: 2026,
        casualLeave: { total: 12, used: 0, available: 12 },
        sickLeave: { total: 8, used: 0, available: 8 },
        earnedLeave: { total: 15, used: 0, available: 15 },
        totalAvailable: 35,
      };
    }
    return balance;
  }

  // ---------------------------------------------------------------------------
  // 6. EMPLOYEE SELF-SERVICE DASHBOARD & PERFORMANCE
  // ---------------------------------------------------------------------------
  async getStaffDashboardSummary(staffId: string): Promise<StaffDashboardSummary> {
    const staff = await this.getStaffById(staffId);
    const todayStr = new Date().toISOString().split('T')[0];

    const attRecord = this.attendanceDb.find(
      (a) => a.staffId === staffId && a.date === todayStr
    );

    const isCheckedIn = !!attRecord?.checkInTime && !attRecord?.checkOutTime;
    const leaveBal = await this.getLeaveBalance(staffId);

    // Mock today appointments assigned to this staff member
    const todayApts = [
      {
        id: 'apt-01',
        appointmentNumber: 'APT-20260910-001',
        customerName: 'Priya Sharma (VIP Platinum)',
        customerPhone: '+91 98765 43210',
        serviceName: 'Balayage & Multi-Dimensional Glaze',
        startTime: '10:30 AM',
        endTime: '12:45 PM',
        status: 'IN_SERVICE',
        price: 6800,
        chairNumber: 'Station 04 (Color Bar)',
        clientNotes: 'Prefers cool ash gloss, patch test passed Sep 2.',
      },
      {
        id: 'apt-02',
        appointmentNumber: 'APT-20260910-004',
        customerName: 'Kavita Reddy',
        customerPhone: '+91 98111 22334',
        serviceName: 'Signature Precision Haircut & Blowdry',
        startTime: '02:00 PM',
        endTime: '02:45 PM',
        status: 'CONFIRMED',
        price: 1800,
        chairNumber: 'Station 04',
        clientNotes: 'Requested textured bob cut.',
      },
      {
        id: 'apt-03',
        appointmentNumber: 'APT-20260910-007',
        customerName: 'Ritu Malhotra',
        customerPhone: '+91 99887 76655',
        serviceName: 'Keratin Smoothing Therapy',
        startTime: '04:30 PM',
        endTime: '06:30 PM',
        status: 'CONFIRMED',
        price: 8500,
        chairNumber: 'Station 04 (Treatment Pod)',
        clientNotes: 'First-time keratin client.',
      },
    ];

    const targetPct =
      staff.monthlyRevenueTarget > 0
        ? Math.min(100, Math.round(((staff.achievedMonthlyRevenue || 0) / staff.monthlyRevenueTarget) * 100))
        : 100;

    const estimatedComm = Math.round((staff.achievedMonthlyRevenue || 0) * (staff.commissionRate / 100));

    return {
      staffMember: staff,
      todayAttendance: {
        isCheckedIn,
        checkInTime: attRecord?.checkInTime || null,
        checkOutTime: attRecord?.checkOutTime || null,
        isOnBreak: attRecord?.isOnBreak || false,
        breakStartTime: attRecord?.breakStartTime || null,
        status: attRecord?.status || 'PRESENT',
        totalHoursWorkedToday: attRecord?.totalWorkingHours || (isCheckedIn ? 2.5 : 0),
        shiftName: 'Morning Shift',
        shiftTiming: '09:00 AM – 06:00 PM',
      },
      performance: {
        todayRevenue: 8600,
        todayServicesCount: 2,
        estimatedDailyCommission: 1290,
        monthlyRevenueTarget: staff.monthlyRevenueTarget,
        monthToDateRevenue: staff.achievedMonthlyRevenue || 0,
        targetProgressPercentage: targetPct,
        monthToDateCommission: estimatedComm,
        rankInBranch: 1,
        totalStaffInBranch: 8,
      },
      todayAppointments: todayApts,
      upcomingAppointmentsCount: 7,
      leaveBalance: leaveBal,
      recentAttendanceLogs: this.attendanceDb.filter((a) => a.staffId === staffId).slice(0, 5),
    };
  }

  async getManagerOverview(branchId?: string): Promise<StaffManagerOverview> {
    let staffList = Array.from(this.staffDb.values());
    if (branchId && branchId !== 'ALL') {
      staffList = staffList.filter((s) => s.assignedBranchIds.includes(branchId));
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAtt = this.attendanceDb.filter((a) => a.date === todayStr);

    let present = 0;
    let late = 0;
    let onBreak = 0;
    let inService = 0;

    todayAtt.forEach((a) => {
      if (a.status === 'PRESENT') present++;
      if (a.status === 'LATE') late++;
      if (a.isOnBreak) onBreak++;
    });

    inService = 3; // Active stylings

    const pendingLeaves = Array.from(this.leaveRequestsDb.values()).filter((l) => l.status === 'PENDING').length;

    const topPerformers = staffList.slice(0, 4).map((s) => ({
      staffId: s.id,
      staffName: s.displayName,
      staffType: s.staffType,
      branchName: s.primaryBranchName || 'Jubilee Hills Flagship',
      revenueThisMonth: s.achievedMonthlyRevenue || 0,
      commissionEarned: Math.round((s.achievedMonthlyRevenue || 0) * (s.commissionRate / 100)),
      targetAchievementPercentage:
        s.monthlyRevenueTarget > 0
          ? Math.round(((s.achievedMonthlyRevenue || 0) / s.monthlyRevenueTarget) * 100)
          : 100,
      servicesCompleted: s.achievedMonthlyServices || 0,
    }));

    return {
      totalStaffCount: staffList.length,
      presentTodayCount: present,
      inServiceCount: inService,
      onBreakCount: onBreak,
      lateTodayCount: late,
      onLeaveTodayCount: 1,
      pendingLeaveRequestsCount: pendingLeaves,
      topPerformingStaff: topPerformers,
    };
  }
}
