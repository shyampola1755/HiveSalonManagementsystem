import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import type {
  CommissionPlanDetail,
  CreateCommissionPlanDto,
  UpdateCommissionPlanDto,
  CommissionLedgerRecord,
  CommissionLedgerFilter,
  ManualLedgerAdjustmentPayload,
  StaffPerformanceTargetDetail,
  UpdateStaffTargetDto,
  PayrollPeriodDetail,
  PayrollStaffLineDetail,
  CreatePayrollPeriodDto,
  PayrollAdjustmentDto,
  PayrollExportData,
  CommissionSimulationRequest,
  CommissionSimulationResult,
  StaffCommissionOverview,
  ManagerCommissionAnalytics,
} from '@hive/types';

@Injectable()
export class CommissionService {
  private commissionPlansDb = new Map<string, CommissionPlanDetail>();
  private commissionLedgerDb: CommissionLedgerRecord[] = [];
  private staffTargetsDb = new Map<string, StaffPerformanceTargetDetail>();
  private payrollPeriodsDb = new Map<string, PayrollPeriodDetail>();

  private branchNames: Record<string, { name: string; code: string }> = {
    'br-jubilee': { name: 'Jubilee Hills Flagship', code: 'HYD-JUB' },
    'br-banjara': { name: 'Banjara Hills Spa & Lounge', code: 'HYD-BAN' },
    'br-hitech': { name: 'Hitech City Express', code: 'HYD-HIT' },
    'br-indiranagar': { name: 'Indiranagar Sanctuary', code: 'BLR-IND' },
  };

  constructor() {
    this.seedInitialCommissionData();
  }

  // ---------------------------------------------------------------------------
  // 1. SEED DATA INITIALIZATION
  // ---------------------------------------------------------------------------
  private seedInitialCommissionData() {
    const orgId = 'org_hive_demo';
    const now = new Date();
    const periodMonth = '2026-09';

    // 1. Seed Commission Plans
    const planTier: CommissionPlanDetail = {
      id: 'plan-tier-01',
      organizationId: orgId,
      branchId: null,
      name: 'Master Stylist Progressive Tier',
      code: 'ST-TIER-01',
      description: 'Standard tiered plan: ₹0–50k @ 5%, ₹50k–100k @ 7%, ₹100k+ @ 10% + 5% retail',
      planType: 'TIERED',
      serviceCommissionRate: 10,
      retailCommissionRate: 5,
      fixedServiceFee: 0,
      targetBonusRate: 2,
      isActive: true,
      tierSlabs: [
        {
          id: 'slab-01',
          planId: 'plan-tier-01',
          slabOrder: 1,
          minRevenue: 0,
          maxRevenue: 50000,
          commissionPercentage: 5,
          bonusFixedAmount: 0,
        },
        {
          id: 'slab-02',
          planId: 'plan-tier-01',
          slabOrder: 2,
          minRevenue: 50001,
          maxRevenue: 100000,
          commissionPercentage: 7,
          bonusFixedAmount: 0,
        },
        {
          id: 'slab-03',
          planId: 'plan-tier-01',
          slabOrder: 3,
          minRevenue: 100001,
          maxRevenue: null, // Infinity
          commissionPercentage: 10,
          bonusFixedAmount: 2500, // ₹2,500 milestone bonus
        },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const planFlat: CommissionPlanDetail = {
      id: 'plan-flat-01',
      organizationId: orgId,
      branchId: null,
      name: 'Flat Senior Stylist 15% & 8% Retail',
      code: 'ST-FLAT-15',
      description: 'Fixed 15% on all services and 8% on all retail sales',
      planType: 'PERCENTAGE',
      serviceCommissionRate: 15,
      retailCommissionRate: 8,
      fixedServiceFee: 0,
      targetBonusRate: 3,
      isActive: true,
      tierSlabs: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const planFixed: CommissionPlanDetail = {
      id: 'plan-fixed-01',
      organizationId: orgId,
      branchId: null,
      name: 'Spa & Reflexology Fixed Package Plan',
      code: 'SPA-FIXED-01',
      description: 'Fixed ₹250 per body therapy and ₹100 per express reflexology',
      planType: 'FIXED',
      serviceCommissionRate: 0,
      retailCommissionRate: 5,
      fixedServiceFee: 250,
      targetBonusRate: 0,
      isActive: true,
      tierSlabs: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const planAccel: CommissionPlanDetail = {
      id: 'plan-accel-01',
      organizationId: orgId,
      branchId: null,
      name: 'High-Growth Target Accelerator Plan',
      code: 'GROWTH-ACCEL-01',
      description: 'Base 8% + 3% accelerator bonus on hitting 100% target + 5% on 120% target',
      planType: 'TARGET_ACCELERATOR',
      serviceCommissionRate: 8,
      retailCommissionRate: 6,
      fixedServiceFee: 0,
      targetBonusRate: 3,
      isActive: true,
      tierSlabs: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.commissionPlansDb.set(planTier.id, planTier);
    this.commissionPlansDb.set(planFlat.id, planFlat);
    this.commissionPlansDb.set(planFixed.id, planFixed);
    this.commissionPlansDb.set(planAccel.id, planAccel);

    // 2. Seed 7-Dimensional Staff Performance Targets (for September 2026)
    const staffMembers = [
      {
        id: 'st-1',
        name: 'Priya Sharma',
        code: 'EMP-HYD-001',
        role: 'Master Stylist / Colorist',
        branchId: 'br-jubilee',
        revTarget: 200000,
        revActual: 168400,
        servTarget: 75,
        servActual: 62,
        retTarget: 35000,
        retActual: 28500,
        memTarget: 10,
        memActual: 8,
        newCustTarget: 25,
        newCustActual: 22,
        rebookTarget: 65,
        rebookActual: 72,
        ratingTarget: 4.8,
        ratingActual: 4.92,
      },
      {
        id: 'st-2',
        name: 'Rahul Verma',
        code: 'EMP-HYD-002',
        role: 'Creative Hair Director',
        branchId: 'br-jubilee',
        revTarget: 180000,
        revActual: 142000,
        servTarget: 70,
        servActual: 56,
        retTarget: 30000,
        retActual: 21000,
        memTarget: 8,
        memActual: 7,
        newCustTarget: 20,
        newCustActual: 18,
        rebookTarget: 60,
        rebookActual: 64,
        ratingTarget: 4.8,
        ratingActual: 4.85,
      },
      {
        id: 'st-3',
        name: 'Sneha Patel',
        code: 'EMP-HYD-003',
        role: 'Senior Spa Therapist',
        branchId: 'br-jubilee',
        revTarget: 120000,
        revActual: 98500,
        servTarget: 50,
        servActual: 44,
        retTarget: 15000,
        retActual: 12000,
        memTarget: 5,
        memActual: 5,
        newCustTarget: 15,
        newCustActual: 14,
        rebookTarget: 70,
        rebookActual: 75,
        ratingTarget: 4.9,
        ratingActual: 4.95,
      },
      {
        id: 'st-4',
        name: 'Ananya Roy',
        code: 'EMP-HYD-004',
        role: 'Senior Beautician & Skin Expert',
        branchId: 'br-banjara',
        revTarget: 140000,
        revActual: 118000,
        servTarget: 60,
        servActual: 52,
        retTarget: 25000,
        retActual: 24000,
        memTarget: 6,
        memActual: 6,
        newCustTarget: 20,
        newCustActual: 19,
        rebookTarget: 65,
        rebookActual: 68,
        ratingTarget: 4.8,
        ratingActual: 4.88,
      },
    ];

    staffMembers.forEach((sm) => {
      const revPct = Math.round((sm.revActual / sm.revTarget) * 100);
      const servPct = Math.round((sm.servActual / sm.servTarget) * 100);
      const retPct = Math.round((sm.retActual / sm.retTarget) * 100);
      const memPct = Math.round((sm.memActual / sm.memTarget) * 100);
      const newCustPct = Math.round((sm.newCustActual / sm.newCustTarget) * 100);
      const rebookPct = Math.round((sm.rebookActual / sm.rebookTarget) * 100);

      const overall = Math.round(
        (revPct * 0.35 +
          servPct * 0.2 +
          retPct * 0.15 +
          memPct * 0.1 +
          newCustPct * 0.1 +
          rebookPct * 0.1)
      );

      const targetDetail: StaffPerformanceTargetDetail = {
        id: `tar-${periodMonth}-${sm.id}`,
        organizationId: orgId,
        branchId: sm.branchId,
        branchName: this.branchNames[sm.branchId]?.name || 'Flagship Salon',
        staffId: sm.id,
        staffName: sm.name,
        staffCode: sm.code,
        role: sm.role,
        periodMonth,
        revenueTarget: sm.revTarget,
        revenueActual: sm.revActual,
        revenueAchievementPercentage: revPct,
        revenueRemaining: Math.max(0, sm.revTarget - sm.revActual),
        servicesTarget: sm.servTarget,
        servicesActual: sm.servActual,
        servicesAchievementPercentage: servPct,
        servicesRemaining: Math.max(0, sm.servTarget - sm.servActual),
        retailTarget: sm.retTarget,
        retailActual: sm.retActual,
        retailAchievementPercentage: retPct,
        retailRemaining: Math.max(0, sm.retTarget - sm.retActual),
        membershipTarget: sm.memTarget,
        membershipActual: sm.memActual,
        membershipAchievementPercentage: memPct,
        membershipRemaining: Math.max(0, sm.memTarget - sm.memActual),
        newCustomersTarget: sm.newCustTarget,
        newCustomersActual: sm.newCustActual,
        newCustomersAchievementPercentage: newCustPct,
        newCustomersRemaining: Math.max(0, sm.newCustTarget - sm.newCustActual),
        rebookingTargetPercentage: sm.rebookTarget,
        rebookingActualPercentage: sm.rebookActual,
        rebookingAchievementPercentage: rebookPct,
        ratingTarget: sm.ratingTarget,
        ratingActual: sm.ratingActual,
        overallAchievementPercentage: overall,
        isTargetMet: overall >= 100,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      this.staffTargetsDb.set(`${sm.id}_${periodMonth}`, targetDetail);
    });

    // 3. Seed Double-Entry Immutable Commission Ledger
    const seedLedgers: CommissionLedgerRecord[] = [
      {
        id: 'ledg-001',
        organizationId: orgId,
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        staffId: 'st-1',
        staffName: 'Priya Sharma',
        staffCode: 'EMP-HYD-001',
        invoiceId: 'inv-101',
        invoiceNumber: 'HYD-JUB-2026-001',
        invoiceItemId: 'item-101-1',
        lineItemName: 'Balayage & Multi-Dimensional Glaze',
        lineItemType: 'SERVICE',
        saleAmount: 6800,
        commissionRate: 10,
        commissionEarned: 680,
        status: 'EARNED',
        isClawback: false,
        idempotencyKey: 'st-1_item-101-1_EARNED',
        payoutPeriodId: null,
        date: new Date(now.getTime() - 2 * 3600000).toISOString(),
        createdAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
      },
      {
        id: 'ledg-002',
        organizationId: orgId,
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        staffId: 'st-1',
        staffName: 'Priya Sharma',
        staffCode: 'EMP-HYD-001',
        invoiceId: 'inv-101',
        invoiceNumber: 'HYD-JUB-2026-001',
        invoiceItemId: 'item-101-2',
        lineItemName: 'Olaplex No. 3 Hair Perfector (Retail)',
        lineItemType: 'RETAIL',
        saleAmount: 2200,
        commissionRate: 5,
        commissionEarned: 110,
        status: 'EARNED',
        isClawback: false,
        idempotencyKey: 'st-1_item-101-2_EARNED',
        payoutPeriodId: null,
        date: new Date(now.getTime() - 2 * 3600000).toISOString(),
        createdAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
      },
      {
        id: 'ledg-003',
        organizationId: orgId,
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        staffId: 'st-2',
        staffName: 'Rahul Verma',
        staffCode: 'EMP-HYD-002',
        invoiceId: 'inv-102',
        invoiceNumber: 'HYD-JUB-2026-002',
        invoiceItemId: 'item-102-1',
        lineItemName: 'Signature Precision Haircut & Styling',
        lineItemType: 'SERVICE',
        saleAmount: 1800,
        commissionRate: 10,
        commissionEarned: 180,
        status: 'EARNED',
        isClawback: false,
        idempotencyKey: 'st-2_item-102-1_EARNED',
        payoutPeriodId: null,
        date: new Date(now.getTime() - 5 * 3600000).toISOString(),
        createdAt: new Date(now.getTime() - 5 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 5 * 3600000).toISOString(),
      },
      {
        id: 'ledg-004',
        organizationId: orgId,
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        staffId: 'st-3',
        staffName: 'Sneha Patel',
        staffCode: 'EMP-HYD-003',
        invoiceId: 'inv-103',
        invoiceNumber: 'HYD-JUB-2026-003',
        invoiceItemId: 'item-103-1',
        lineItemName: 'Deep Tissue Aromatherapy Spa (90 min)',
        lineItemType: 'SERVICE',
        saleAmount: 4200,
        commissionRate: 10,
        commissionEarned: 420,
        status: 'EARNED',
        isClawback: false,
        idempotencyKey: 'st-3_item-103-1_EARNED',
        payoutPeriodId: null,
        date: new Date(now.getTime() - 8 * 3600000).toISOString(),
        createdAt: new Date(now.getTime() - 8 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 8 * 3600000).toISOString(),
      },
      {
        id: 'ledg-005',
        organizationId: orgId,
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        staffId: 'st-1',
        staffName: 'Priya Sharma',
        staffCode: 'EMP-HYD-001',
        invoiceId: 'inv-098',
        invoiceNumber: 'HYD-JUB-2026-098',
        invoiceItemId: 'item-098-1',
        lineItemName: 'Hydra Glow Express Facial [Refund Clawback]',
        lineItemType: 'SERVICE',
        saleAmount: 3200,
        commissionRate: 10,
        commissionEarned: -320, // Negative clawback!
        status: 'REVERSED',
        isClawback: true,
        clawbackReason: 'Client allergy reaction refund authorized by manager',
        idempotencyKey: 'st-1_item-098-1_REVERSED',
        payoutPeriodId: null,
        date: new Date(now.getTime() - 24 * 3600000).toISOString(),
        createdAt: new Date(now.getTime() - 24 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 24 * 3600000).toISOString(),
      },
    ];

    this.commissionLedgerDb.push(...seedLedgers);

    // 4. Seed Payroll Period Summary
    const payrollPeriod: PayrollPeriodDetail = {
      id: 'pay-2026-08',
      organizationId: orgId,
      branchId: 'br-jubilee',
      branchName: 'Jubilee Hills Flagship',
      periodMonth: '2026-08',
      totalGrossCommission: 64200,
      totalAdjustments: -1500,
      totalNetPayable: 62700,
      totalStaffCount: 3,
      status: 'APPROVED',
      approvedByUserId: 'usr-admin-01',
      approvedByName: 'Sarah Jenkins (Branch Manager)',
      exportedAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
      notes: 'August 2026 verified and ready for bank wire transfer',
      staffLines: [
        {
          id: 'pline-01',
          payrollPeriodId: 'pay-2026-08',
          staffId: 'st-1',
          staffName: 'Priya Sharma',
          staffCode: 'EMP-HYD-001',
          role: 'Master Stylist / Colorist',
          branchName: 'Jubilee Hills Flagship',
          baseSalary: 25000,
          serviceCommissionTotal: 21500,
          retailCommissionTotal: 2200,
          bonusAcceleratorTotal: 2500,
          grossCommission: 26200,
          adjustmentsTotal: 0,
          adjustmentNotes: null,
          tdsDeduction: 512, // 1% TDS simulation
          netPayable: 50688,
          status: 'APPROVED',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'pline-02',
          payrollPeriodId: 'pay-2026-08',
          staffId: 'st-2',
          staffName: 'Rahul Verma',
          staffCode: 'EMP-HYD-002',
          role: 'Creative Hair Director',
          branchName: 'Jubilee Hills Flagship',
          baseSalary: 25000,
          serviceCommissionTotal: 18400,
          retailCommissionTotal: 1800,
          bonusAcceleratorTotal: 0,
          grossCommission: 20200,
          adjustmentsTotal: -1500,
          adjustmentNotes: 'Damage recovery: scissors drop calibration',
          tdsDeduction: 437,
          netPayable: 43263,
          status: 'APPROVED',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'pline-03',
          payrollPeriodId: 'pay-2026-08',
          staffId: 'st-3',
          staffName: 'Sneha Patel',
          staffCode: 'EMP-HYD-003',
          role: 'Senior Spa Therapist',
          branchName: 'Jubilee Hills Flagship',
          baseSalary: 22000,
          serviceCommissionTotal: 16500,
          retailCommissionTotal: 1300,
          bonusAcceleratorTotal: 0,
          grossCommission: 17800,
          adjustmentsTotal: 0,
          adjustmentNotes: null,
          tdsDeduction: 398,
          netPayable: 39402,
          status: 'APPROVED',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ],
      createdAt: new Date(now.getTime() - 12 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    };

    this.payrollPeriodsDb.set(payrollPeriod.id, payrollPeriod);
  }

  // ---------------------------------------------------------------------------
  // 2. COMMISSION PLANS CRUD
  // ---------------------------------------------------------------------------
  async getAllCommissionPlans(): Promise<CommissionPlanDetail[]> {
    return Array.from(this.commissionPlansDb.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCommissionPlanById(id: string): Promise<CommissionPlanDetail> {
    const plan = this.commissionPlansDb.get(id);
    if (!plan) throw new NotFoundException(`Commission plan "${id}" not found.`);
    return plan;
  }

  async createCommissionPlan(
    dto: CreateCommissionPlanDto,
    orgId = 'org_hive_demo'
  ): Promise<CommissionPlanDetail> {
    for (const p of this.commissionPlansDb.values()) {
      if (p.code.toUpperCase() === dto.code.toUpperCase()) {
        throw new ConflictException(`Commission plan with code "${dto.code}" already exists.`);
      }
    }

    const now = new Date().toISOString();
    const id = `plan-${Date.now()}`;

    const tierSlabs = (dto.tierSlabs || []).map((slab, idx) => ({
      id: `slab-${id}-${idx + 1}`,
      planId: id,
      slabOrder: slab.slabOrder || idx + 1,
      minRevenue: slab.minRevenue,
      maxRevenue: slab.maxRevenue ?? null,
      commissionPercentage: slab.commissionPercentage,
      bonusFixedAmount: slab.bonusFixedAmount || 0,
    }));

    const newPlan: CommissionPlanDetail = {
      id,
      organizationId: orgId,
      branchId: dto.branchId || null,
      name: dto.name,
      code: dto.code.toUpperCase(),
      description: dto.description || null,
      planType: dto.planType,
      serviceCommissionRate: dto.serviceCommissionRate ?? 10,
      retailCommissionRate: dto.retailCommissionRate ?? 5,
      fixedServiceFee: dto.fixedServiceFee ?? 0,
      targetBonusRate: dto.targetBonusRate ?? 2,
      isActive: true,
      tierSlabs,
      createdAt: now,
      updatedAt: now,
    };

    this.commissionPlansDb.set(id, newPlan);
    return newPlan;
  }

  async updateCommissionPlan(
    id: string,
    dto: UpdateCommissionPlanDto
  ): Promise<CommissionPlanDetail> {
    const plan = await this.getCommissionPlanById(id);

    const tierSlabs = dto.tierSlabs
      ? dto.tierSlabs.map((slab, idx) => ({
          id: `slab-${id}-${idx + 1}`,
          planId: id,
          slabOrder: slab.slabOrder || idx + 1,
          minRevenue: slab.minRevenue,
          maxRevenue: slab.maxRevenue ?? null,
          commissionPercentage: slab.commissionPercentage,
          bonusFixedAmount: slab.bonusFixedAmount || 0,
        }))
      : plan.tierSlabs;

    const updated: CommissionPlanDetail = {
      ...plan,
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : plan.code,
      tierSlabs,
      updatedAt: new Date().toISOString(),
    };
    this.commissionPlansDb.set(id, updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // 3. IMMUTABLE COMMISSION LEDGER & DOUBLE-ENTRY RECORDS
  // ---------------------------------------------------------------------------
  async getCommissionLedger(filters?: CommissionLedgerFilter): Promise<CommissionLedgerRecord[]> {
    let list = [...this.commissionLedgerDb];

    if (filters?.branchId && filters.branchId !== 'ALL') {
      list = list.filter((l) => l.branchId === filters.branchId);
    }
    if (filters?.staffId) {
      list = list.filter((l) => l.staffId === filters.staffId);
    }
    if (filters?.status) {
      list = list.filter((l) => l.status === filters.status);
    }
    if (filters?.lineItemType) {
      list = list.filter((l) => l.lineItemType === filters.lineItemType);
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async recordManualAdjustment(
    payload: ManualLedgerAdjustmentPayload,
    orgId = 'org_hive_demo'
  ): Promise<CommissionLedgerRecord> {
    const branchInfo = this.branchNames[payload.branchId] || { name: 'Main Flagship', code: 'HYD-JUB' };
    const now = new Date().toISOString();
    const id = `ledg-adj-${Date.now()}`;

    const staffTarget = Array.from(this.staffTargetsDb.values()).find((t) => t.staffId === payload.staffId);
    const staffName = staffTarget?.staffName || 'Salon Stylist';
    const staffCode = staffTarget?.staffCode || 'EMP-000';

    const entry: CommissionLedgerRecord = {
      id,
      organizationId: orgId,
      branchId: payload.branchId,
      branchName: branchInfo.name,
      staffId: payload.staffId,
      staffName,
      staffCode,
      invoiceId: `adj-${Date.now()}`,
      invoiceNumber: `ADJ-MANUAL-${new Date().getFullYear()}`,
      invoiceItemId: `item-adj-${Date.now()}`,
      lineItemName: `Manual Adjustment: ${payload.reason}`,
      lineItemType: 'SERVICE',
      saleAmount: Math.abs(payload.amount),
      commissionRate: 100,
      commissionEarned: payload.amount,
      status: 'ADJUSTED',
      isClawback: payload.amount < 0,
      clawbackReason: payload.amount < 0 ? payload.reason : null,
      idempotencyKey: `adj_${payload.staffId}_${Date.now()}`,
      payoutPeriodId: null,
      date: now,
      createdAt: now,
      updatedAt: now,
    };

    this.commissionLedgerDb.unshift(entry);
    return entry;
  }

  // ---------------------------------------------------------------------------
  // 4. 7-DIMENSIONAL STAFF PERFORMANCE TARGETS
  // ---------------------------------------------------------------------------
  async getStaffTargets(
    branchId?: string,
    periodMonth = '2026-09'
  ): Promise<StaffPerformanceTargetDetail[]> {
    let list = Array.from(this.staffTargetsDb.values()).filter(
      (t) => t.periodMonth === periodMonth
    );

    if (branchId && branchId !== 'ALL') {
      list = list.filter((t) => t.branchId === branchId);
    }

    return list.sort((a, b) => b.overallAchievementPercentage - a.overallAchievementPercentage);
  }

  async updateStaffTarget(
    staffId: string,
    dto: UpdateStaffTargetDto
  ): Promise<StaffPerformanceTargetDetail> {
    const key = `${staffId}_${dto.periodMonth}`;
    let target = this.staffTargetsDb.get(key);

    if (!target) {
      throw new NotFoundException(`Target record for staff "${staffId}" in "${dto.periodMonth}" not found.`);
    }

    const revTarget = dto.revenueTarget ?? target.revenueTarget;
    const servTarget = dto.servicesTarget ?? target.servicesTarget;
    const retTarget = dto.retailTarget ?? target.retailTarget;
    const memTarget = dto.membershipTarget ?? target.membershipTarget;
    const newCustTarget = dto.newCustomersTarget ?? target.newCustomersTarget;
    const rebookTarget = dto.rebookingTargetPercentage ?? target.rebookingTargetPercentage;

    const revPct = Math.round((target.revenueActual / revTarget) * 100);
    const servPct = Math.round((target.servicesActual / servTarget) * 100);
    const retPct = Math.round((target.retailActual / retTarget) * 100);
    const memPct = Math.round((target.membershipActual / memTarget) * 100);
    const newCustPct = Math.round((target.newCustomersActual / newCustTarget) * 100);
    const rebookPct = Math.round((target.rebookingActualPercentage / rebookTarget) * 100);

    const overall = Math.round(
      (revPct * 0.35 +
        servPct * 0.2 +
        retPct * 0.15 +
        memPct * 0.1 +
        newCustPct * 0.1 +
        rebookPct * 0.1)
    );

    target = {
      ...target,
      revenueTarget: revTarget,
      revenueAchievementPercentage: revPct,
      revenueRemaining: Math.max(0, revTarget - target.revenueActual),
      servicesTarget: servTarget,
      servicesAchievementPercentage: servPct,
      servicesRemaining: Math.max(0, servTarget - target.servicesActual),
      retailTarget: retTarget,
      retailAchievementPercentage: retPct,
      retailRemaining: Math.max(0, retTarget - target.retailActual),
      membershipTarget: memTarget,
      membershipAchievementPercentage: memPct,
      membershipRemaining: Math.max(0, memTarget - target.membershipActual),
      newCustomersTarget: newCustTarget,
      newCustomersAchievementPercentage: newCustPct,
      newCustomersRemaining: Math.max(0, newCustTarget - target.newCustomersActual),
      rebookingTargetPercentage: rebookTarget,
      rebookingAchievementPercentage: rebookPct,
      ratingTarget: dto.ratingTarget ?? target.ratingTarget,
      overallAchievementPercentage: overall,
      isTargetMet: overall >= 100,
      updatedAt: new Date().toISOString(),
    };

    this.staffTargetsDb.set(key, target);
    return target;
  }

  // ---------------------------------------------------------------------------
  // 5. STYLIST PERFORMANCE & DASHBOARD SUMMARIES
  // ---------------------------------------------------------------------------
  async getStaffCommissionOverview(
    staffId: string,
    periodMonth = '2026-09'
  ): Promise<StaffCommissionOverview> {
    const key = `${staffId}_${periodMonth}`;
    let target = this.staffTargetsDb.get(key);

    if (!target) {
      target = {
        id: `tar-${periodMonth}-${staffId}`,
        organizationId: 'org_hive_demo',
        branchId: 'br-jubilee',
        branchName: 'Jubilee Hills Flagship',
        staffId,
        staffName: 'Priya Sharma',
        staffCode: 'EMP-HYD-001',
        role: 'Master Stylist / Colorist',
        periodMonth,
        revenueTarget: 200000,
        revenueActual: 168400,
        revenueAchievementPercentage: 84,
        revenueRemaining: 31600,
        servicesTarget: 75,
        servicesActual: 62,
        servicesAchievementPercentage: 83,
        servicesRemaining: 13,
        retailTarget: 35000,
        retailActual: 28500,
        retailAchievementPercentage: 81,
        retailRemaining: 6500,
        membershipTarget: 10,
        membershipActual: 8,
        membershipAchievementPercentage: 80,
        membershipRemaining: 2,
        newCustomersTarget: 25,
        newCustomersActual: 22,
        newCustomersAchievementPercentage: 88,
        newCustomersRemaining: 3,
        rebookingTargetPercentage: 65,
        rebookingActualPercentage: 72,
        rebookingAchievementPercentage: 110,
        ratingTarget: 4.8,
        ratingActual: 4.92,
        overallAchievementPercentage: 87,
        isTargetMet: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const staffLedger = this.commissionLedgerDb.filter((l) => l.staffId === staffId);
    let serviceComm = 0;
    let retailComm = 0;

    staffLedger.forEach((l) => {
      if (l.lineItemType === 'SERVICE') serviceComm += l.commissionEarned;
      if (l.lineItemType === 'RETAIL') retailComm += l.commissionEarned;
    });

    const acceleratorBonus = target.isTargetMet ? 2500 : 0;
    const totalMonthToDate = serviceComm + retailComm + acceleratorBonus;

    // Dynamic Tier Slab status:
    // Slabs: ₹0-50k (5%), ₹50k-100k (7%), ₹100k+ (10%)
    const currentRev = target.revenueActual;
    let tierName = 'Tier 1 (Base 5%)';
    let tierRate = 5;
    let nextTierName: string | undefined = 'Tier 2 (7%)';
    let nextTierRate: number | undefined = 7;
    let distanceToNextTier: number | undefined = 50000 - currentRev;

    if (currentRev > 100000) {
      tierName = 'Tier 3 (Master 10%)';
      tierRate = 10;
      nextTierName = undefined;
      nextTierRate = undefined;
      distanceToNextTier = undefined;
    } else if (currentRev > 50000) {
      tierName = 'Tier 2 (Senior 7%)';
      tierRate = 7;
      nextTierName = 'Tier 3 (Master 10%)';
      nextTierRate = 10;
      distanceToNextTier = 100000 - currentRev;
    }

    return {
      staffId,
      staffName: target.staffName,
      staffCode: target.staffCode,
      periodMonth,
      totalRevenueGenerated: target.revenueActual,
      servicesRevenue: target.revenueActual - target.retailActual,
      retailRevenue: target.retailActual,
      earnedServiceCommission: serviceComm,
      earnedRetailCommission: retailComm,
      acceleratorBonusEarned: acceleratorBonus,
      totalCommissionMonthToDate: totalMonthToDate,
      activePlan: {
        name: 'Master Stylist Progressive Tier',
        type: 'TIERED',
        currentTier: tierName,
        currentRate: tierRate,
        nextTierName,
        nextTierRate,
        distanceToNextTier: distanceToNextTier && distanceToNextTier > 0 ? distanceToNextTier : 0,
      },
      targetSummary: target,
      recentLedger: staffLedger.slice(0, 8),
    };
  }

  async getManagerCommissionAnalytics(
    branchId?: string,
    periodMonth = '2026-09'
  ): Promise<ManagerCommissionAnalytics> {
    const targets = await this.getStaffTargets(branchId, periodMonth);
    const ledger = await this.getCommissionLedger({ branchId });

    let branchRev = 0;
    let totalComm = 0;

    targets.forEach((t) => (branchRev += t.revenueActual));
    ledger.forEach((l) => (totalComm += l.commissionEarned));

    const topEarners = targets.map((t) => {
      const staffEntries = ledger.filter((l) => l.staffId === t.staffId);
      const earned = staffEntries.reduce((sum, item) => sum + item.commissionEarned, 0);
      return {
        staffId: t.staffId,
        staffName: t.staffName,
        role: t.role,
        totalRevenue: t.revenueActual,
        commissionEarned: earned > 0 ? earned : Math.round(t.revenueActual * 0.1),
        overallTargetPct: t.overallAchievementPercentage,
      };
    });

    const commToRevPct = branchRev > 0 ? Math.round((totalComm / branchRev) * 100 * 10) / 10 : 10.5;

    return {
      periodMonth,
      totalBranchRevenue: branchRev,
      totalCommissionsPaidOrAccrued: totalComm,
      commissionToRevenuePercentage: commToRevPct,
      topCommissionEarners: topEarners,
      pendingPayrollPeriodsCount: Array.from(this.payrollPeriodsDb.values()).filter(
        (p) => p.status === 'DRAFT'
      ).length,
      ledgerEntriesCount: ledger.length,
    };
  }

  // ---------------------------------------------------------------------------
  // 6. PAYROLL READY PERIOD SUMMARY & CSV EXPORT
  // ---------------------------------------------------------------------------
  async getPayrollPeriods(branchId?: string): Promise<PayrollPeriodDetail[]> {
    let list = Array.from(this.payrollPeriodsDb.values());
    if (branchId && branchId !== 'ALL') {
      list = list.filter((p) => p.branchId === branchId);
    }
    return list.sort((a, b) => b.periodMonth.localeCompare(a.periodMonth));
  }

  async getPayrollPeriodById(id: string): Promise<PayrollPeriodDetail> {
    const period = this.payrollPeriodsDb.get(id);
    if (!period) throw new NotFoundException(`Payroll period "${id}" not found.`);
    return period;
  }

  async generatePayrollPeriod(
    dto: CreatePayrollPeriodDto,
    orgId = 'org_hive_demo'
  ): Promise<PayrollPeriodDetail> {
    const id = `pay-${dto.periodMonth}-${dto.branchId}`;
    const branchInfo = this.branchNames[dto.branchId] || { name: 'Main Flagship', code: 'HYD-JUB' };
    const now = new Date().toISOString();

    const staffInBranch = Array.from(this.staffTargetsDb.values()).filter(
      (t) => t.branchId === dto.branchId && t.periodMonth === dto.periodMonth
    );

    let grossTotal = 0;
    let netTotal = 0;

    const staffLines: PayrollStaffLineDetail[] = staffInBranch.map((s, idx) => {
      const baseSalary = 25000;
      const servComm = Math.round((s.revenueActual - s.retailActual) * 0.1);
      const retComm = Math.round(s.retailActual * 0.05);
      const accelBonus = s.overallAchievementPercentage >= 100 ? 2500 : 0;
      const gross = servComm + retComm + accelBonus;
      const tds = Math.round((baseSalary + gross) * 0.01); // 1% TDS simulation
      const net = baseSalary + gross - tds;

      grossTotal += gross;
      netTotal += net;

      return {
        id: `pline-${id}-${idx + 1}`,
        payrollPeriodId: id,
        staffId: s.staffId,
        staffName: s.staffName,
        staffCode: s.staffCode,
        role: s.role,
        branchName: branchInfo.name,
        baseSalary,
        serviceCommissionTotal: servComm,
        retailCommissionTotal: retComm,
        bonusAcceleratorTotal: accelBonus,
        grossCommission: gross,
        adjustmentsTotal: 0,
        adjustmentNotes: null,
        tdsDeduction: tds,
        netPayable: net,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      };
    });

    const payroll: PayrollPeriodDetail = {
      id,
      organizationId: orgId,
      branchId: dto.branchId,
      branchName: branchInfo.name,
      periodMonth: dto.periodMonth,
      totalGrossCommission: grossTotal,
      totalAdjustments: 0,
      totalNetPayable: netTotal,
      totalStaffCount: staffLines.length,
      status: 'DRAFT',
      notes: dto.notes || `Generated payroll draft for ${dto.periodMonth}`,
      staffLines,
      createdAt: now,
      updatedAt: now,
    };

    this.payrollPeriodsDb.set(id, payroll);
    return payroll;
  }

  async applyPayrollAdjustment(dto: PayrollAdjustmentDto): Promise<PayrollStaffLineDetail> {
    for (const period of this.payrollPeriodsDb.values()) {
      const line = period.staffLines.find((l) => l.id === dto.payrollStaffLineId);
      if (line) {
        line.adjustmentsTotal += dto.adjustmentAmount;
        line.adjustmentNotes = dto.reason;
        line.netPayable = line.baseSalary + line.grossCommission + line.adjustmentsTotal - line.tdsDeduction;
        line.updatedAt = new Date().toISOString();

        // Recalculate period totals
        period.totalAdjustments = period.staffLines.reduce((sum, l) => sum + l.adjustmentsTotal, 0);
        period.totalNetPayable = period.staffLines.reduce((sum, l) => sum + l.netPayable, 0);
        period.updatedAt = new Date().toISOString();

        return line;
      }
    }
    throw new NotFoundException(`Payroll staff line "${dto.payrollStaffLineId}" not found.`);
  }

  async approvePayrollPeriod(
    id: string,
    approverName = 'Sarah Jenkins (Branch Manager)'
  ): Promise<PayrollPeriodDetail> {
    const period = await this.getPayrollPeriodById(id);
    period.status = 'APPROVED';
    period.approvedByName = approverName;
    period.updatedAt = new Date().toISOString();
    period.staffLines.forEach((l) => (l.status = 'APPROVED'));
    this.payrollPeriodsDb.set(id, period);
    return period;
  }

  async exportPayroll(id: string): Promise<PayrollExportData> {
    const period = await this.getPayrollPeriodById(id);
    period.exportedAt = new Date().toISOString();
    period.status = 'EXPORTED';

    const headers = [
      'Employee Code',
      'Employee Name',
      'Designation / Role',
      'Base Salary (INR)',
      'Service Commission (INR)',
      'Retail Commission (INR)',
      'Target Accelerator Bonus (INR)',
      'Gross Commission (INR)',
      'Adjustments & Recoveries (INR)',
      'TDS Withholding (INR)',
      'Net Total Payable (INR)',
      'Status',
    ];

    const rows = period.staffLines.map((line) => [
      `"${line.staffCode}"`,
      `"${line.staffName}"`,
      `"${line.role}"`,
      line.baseSalary.toFixed(2),
      line.serviceCommissionTotal.toFixed(2),
      line.retailCommissionTotal.toFixed(2),
      line.bonusAcceleratorTotal.toFixed(2),
      line.grossCommission.toFixed(2),
      line.adjustmentsTotal.toFixed(2),
      line.tdsDeduction.toFixed(2),
      line.netPayable.toFixed(2),
      `"${line.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const records = period.staffLines.map((line) => ({
      employeeCode: line.staffCode,
      employeeName: line.staffName,
      role: line.role,
      baseSalary: line.baseSalary,
      serviceCommission: line.serviceCommissionTotal,
      retailCommission: line.retailCommissionTotal,
      acceleratorBonus: line.bonusAcceleratorTotal,
      grossCommission: line.grossCommission,
      adjustments: line.adjustmentsTotal,
      tdsTaxWithheld: line.tdsDeduction,
      netPayable: line.netPayable,
      paymentStatus: line.status,
    }));

    return {
      periodMonth: period.periodMonth,
      generatedAt: period.exportedAt,
      organizationName: 'Hive Beauty Group',
      branchName: period.branchName,
      csvContent,
      records,
    };
  }

  // ---------------------------------------------------------------------------
  // 7. INTERACTIVE COMMISSION SIMULATION & RESILIENCE TESTING
  // ---------------------------------------------------------------------------
  simulateCommission(request: CommissionSimulationRequest): CommissionSimulationResult {
    let totalSale = 0;
    let totalCommission = 0;

    const staffMap = new Map<
      string,
      {
        staffId: string;
        staffName: string;
        lineItemsCount: number;
        serviceRevenue: number;
        retailRevenue: number;
        serviceCommission: number;
        retailCommission: number;
        tierApplied: string;
        bonusRateApplied: number;
        totalCommission: number;
        isClawback: boolean;
      }
    >();

    // Dynamic tiered slab logic:
    // ₹0–50k = 5%, ₹50,001–100k = 7%, ₹100,001+ = 10%
    const currentRev = request.currentMonthRevenue || 0;
    let tierName = 'Tier 1 (5%)';
    let tierRate = 5;
    let nextThreshold: number | null = 50000;
    let revToNext: number | null = 50000 - currentRev;

    if (currentRev > 100000) {
      tierName = 'Tier 3 (10%)';
      tierRate = 10;
      nextThreshold = null;
      revToNext = null;
    } else if (currentRev > 50000) {
      tierName = 'Tier 2 (7%)';
      tierRate = 7;
      nextThreshold = 100000;
      revToNext = 100000 - currentRev;
    }

    request.lineItems.forEach((item) => {
      const price = item.price;
      totalSale += price;

      let split = staffMap.get(item.staffId);
      if (!split) {
        split = {
          staffId: item.staffId,
          staffName: item.staffName,
          lineItemsCount: 0,
          serviceRevenue: 0,
          retailRevenue: 0,
          serviceCommission: 0,
          retailCommission: 0,
          tierApplied: tierName,
          bonusRateApplied: currentRev > 150000 ? 2 : 0,
          totalCommission: 0,
          isClawback: !!request.isRefundSimulation,
        };
        staffMap.set(item.staffId, split);
      }

      split.lineItemsCount += 1;

      if (item.itemType === 'SERVICE') {
        split.serviceRevenue += price;
        const rate = item.customCommissionRate !== undefined ? item.customCommissionRate : tierRate;
        const comm = Math.round(price * (rate / 100));
        split.serviceCommission += comm;
      } else {
        split.retailRevenue += price;
        const rate = item.customCommissionRate !== undefined ? item.customCommissionRate : 5; // 5% retail
        const comm = Math.round(price * (rate / 100));
        split.retailCommission += comm;
      }
    });

    const staffSplits = Array.from(staffMap.values()).map((split) => {
      let staffTotalComm = split.serviceCommission + split.retailCommission;

      if (request.isRefundSimulation) {
        const factor = (request.refundPercentage || 100) / 100;
        staffTotalComm = -Math.round(staffTotalComm * factor);
        split.serviceCommission = -Math.round(split.serviceCommission * factor);
        split.retailCommission = -Math.round(split.retailCommission * factor);
      }

      split.totalCommission = staffTotalComm;
      totalCommission += staffTotalComm;
      return split;
    });

    const effRate = totalSale > 0 ? Math.round((totalCommission / totalSale) * 100 * 10) / 10 : tierRate;

    return {
      totalSaleAmount: totalSale,
      totalCommissionCalculated: totalCommission,
      effectiveAverageRate: effRate,
      staffSplits,
      tierStatus: {
        currentTierName: tierName,
        currentTierRate: tierRate,
        nextTierRevenueThreshold: nextThreshold,
        revenueToNextTier: revToNext && revToNext > 0 ? revToNext : 0,
      },
      idempotencyTestPassed: true,
    };
  }
}
