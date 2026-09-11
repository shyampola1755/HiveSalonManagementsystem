/**
 * Phase 10: Commission Engine, Targets & Payroll-Ready Calculations Types
 */

export type CommissionPlanType =
  | 'PERCENTAGE'
  | 'FIXED'
  | 'TIERED'
  | 'TARGET_ACCELERATOR';

export type CommissionLedgerStatus =
  | 'EARNED'
  | 'PENDING_PAYOUT'
  | 'PAID'
  | 'REVERSED'
  | 'ADJUSTED';

export type PayrollPeriodStatus =
  | 'DRAFT'
  | 'APPROVED'
  | 'PROCESSED'
  | 'EXPORTED';

export type PayrollStaffStatus = 'PENDING' | 'APPROVED' | 'PAID';

// -----------------------------------------------------------------------------
// 1. COMMISSION PLANS & TIER SLABS
// -----------------------------------------------------------------------------

export interface CommissionTierSlabDetail {
  id: string;
  planId: string;
  slabOrder: number;
  minRevenue: number;
  maxRevenue: number | null; // null = infinity
  commissionPercentage: number;
  bonusFixedAmount: number;
}

export interface CommissionPlanDetail {
  id: string;
  organizationId: string;
  branchId: string | null;
  name: string;
  code: string;
  description?: string | null;
  planType: CommissionPlanType;
  serviceCommissionRate: number; // base %
  retailCommissionRate: number; // retail %
  fixedServiceFee: number;
  targetBonusRate: number;
  isActive: boolean;
  tierSlabs: CommissionTierSlabDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionTierSlabDto {
  slabOrder: number;
  minRevenue: number;
  maxRevenue?: number | null;
  commissionPercentage: number;
  bonusFixedAmount?: number;
}

export interface CreateCommissionPlanDto {
  name: string;
  code: string;
  description?: string;
  planType: CommissionPlanType;
  serviceCommissionRate?: number;
  retailCommissionRate?: number;
  fixedServiceFee?: number;
  targetBonusRate?: number;
  branchId?: string;
  tierSlabs?: CreateCommissionTierSlabDto[];
}

export interface UpdateCommissionPlanDto extends Partial<CreateCommissionPlanDto> {
  isActive?: boolean;
}

// -----------------------------------------------------------------------------
// 2. COMMISSION LEDGER & LINE ITEM ATTRIBUTION
// -----------------------------------------------------------------------------

export interface CommissionLedgerRecord {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceItemId: string;
  lineItemName: string;
  lineItemType: 'SERVICE' | 'RETAIL' | 'MEMBERSHIP' | 'PACKAGE';
  saleAmount: number;
  commissionRate: number; // % applied or fixed amount
  commissionEarned: number; // positive or negative (clawback)
  status: CommissionLedgerStatus;
  isClawback: boolean;
  clawbackReason?: string | null;
  idempotencyKey: string;
  payoutPeriodId?: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionLedgerFilter {
  branchId?: string;
  staffId?: string;
  status?: CommissionLedgerStatus;
  startDate?: string;
  endDate?: string;
  lineItemType?: string;
}

export interface ManualLedgerAdjustmentPayload {
  staffId: string;
  branchId: string;
  amount: number; // positive for bonus, negative for deduction
  reason: string;
  performedByName?: string;
}

// -----------------------------------------------------------------------------
// 3. 7-DIMENSIONAL STAFF PERFORMANCE TARGETS
// -----------------------------------------------------------------------------

export interface StaffPerformanceTargetDetail {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  role: string;
  periodMonth: string; // "YYYY-MM"
  revenueTarget: number;
  revenueActual: number;
  revenueAchievementPercentage: number;
  revenueRemaining: number;

  servicesTarget: number;
  servicesActual: number;
  servicesAchievementPercentage: number;
  servicesRemaining: number;

  retailTarget: number;
  retailActual: number;
  retailAchievementPercentage: number;
  retailRemaining: number;

  membershipTarget: number;
  membershipActual: number;
  membershipAchievementPercentage: number;
  membershipRemaining: number;

  newCustomersTarget: number;
  newCustomersActual: number;
  newCustomersAchievementPercentage: number;
  newCustomersRemaining: number;

  rebookingTargetPercentage: number;
  rebookingActualPercentage: number;
  rebookingAchievementPercentage: number;

  ratingTarget: number;
  ratingActual: number;

  overallAchievementPercentage: number;
  isTargetMet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStaffTargetDto {
  staffId: string;
  branchId: string;
  periodMonth: string;
  revenueTarget?: number;
  servicesTarget?: number;
  retailTarget?: number;
  membershipTarget?: number;
  newCustomersTarget?: number;
  rebookingTargetPercentage?: number;
  ratingTarget?: number;
}

// -----------------------------------------------------------------------------
// 4. PAYROLL READY SUMMARY & EXPORT
// -----------------------------------------------------------------------------

export interface PayrollStaffLineDetail {
  id: string;
  payrollPeriodId: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  role: string;
  branchName: string;
  baseSalary: number;
  serviceCommissionTotal: number;
  retailCommissionTotal: number;
  bonusAcceleratorTotal: number;
  grossCommission: number;
  adjustmentsTotal: number;
  adjustmentNotes?: string | null;
  tdsDeduction: number; // TDS simulation (e.g. 1% TDS on professional payouts)
  netPayable: number;
  status: PayrollStaffStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollPeriodDetail {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  periodMonth: string; // "YYYY-MM"
  totalGrossCommission: number;
  totalAdjustments: number;
  totalNetPayable: number;
  totalStaffCount: number;
  status: PayrollPeriodStatus;
  exportedAt?: string | null;
  approvedByUserId?: string | null;
  approvedByName?: string | null;
  notes?: string | null;
  staffLines: PayrollStaffLineDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayrollPeriodDto {
  branchId: string;
  periodMonth: string; // "YYYY-MM"
  notes?: string;
}

export interface PayrollAdjustmentDto {
  payrollStaffLineId: string;
  adjustmentAmount: number; // positive or negative
  reason: string;
}

export interface PayrollExportData {
  periodMonth: string;
  generatedAt: string;
  organizationName: string;
  branchName: string;
  csvContent: string;
  records: Array<{
    employeeCode: string;
    employeeName: string;
    role: string;
    baseSalary: number;
    serviceCommission: number;
    retailCommission: number;
    acceleratorBonus: number;
    grossCommission: number;
    adjustments: number;
    tdsTaxWithheld: number;
    netPayable: number;
    paymentStatus: string;
  }>;
}

// -----------------------------------------------------------------------------
// 5. INTERACTIVE TESTING & SIMULATION ENGINE
// -----------------------------------------------------------------------------

export interface CommissionSimulationLineItem {
  itemType: 'SERVICE' | 'RETAIL';
  name: string;
  price: number;
  staffId: string;
  staffName: string;
  customCommissionRate?: number;
}

export interface CommissionSimulationRequest {
  branchId: string;
  currentMonthRevenue: number;
  planId?: string;
  lineItems: CommissionSimulationLineItem[];
  isRefundSimulation?: boolean;
  refundPercentage?: number;
}

export interface CommissionSimulationResult {
  totalSaleAmount: number;
  totalCommissionCalculated: number;
  effectiveAverageRate: number;
  staffSplits: Array<{
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
  }>;
  tierStatus: {
    currentTierName: string;
    currentTierRate: number;
    nextTierRevenueThreshold: number | null;
    revenueToNextTier: number | null;
  };
  idempotencyTestPassed: boolean;
}

// -----------------------------------------------------------------------------
// 6. DASHBOARDS & SUMMARIES
// -----------------------------------------------------------------------------

export interface StaffCommissionOverview {
  staffId: string;
  staffName: string;
  staffCode: string;
  periodMonth: string;
  totalRevenueGenerated: number;
  servicesRevenue: number;
  retailRevenue: number;
  earnedServiceCommission: number;
  earnedRetailCommission: number;
  acceleratorBonusEarned: number;
  totalCommissionMonthToDate: number;
  activePlan: {
    name: string;
    type: CommissionPlanType;
    currentTier: string;
    currentRate: number;
    nextTierName?: string;
    nextTierRate?: number;
    distanceToNextTier?: number;
  };
  targetSummary: StaffPerformanceTargetDetail;
  recentLedger: CommissionLedgerRecord[];
}

export interface ManagerCommissionAnalytics {
  periodMonth: string;
  totalBranchRevenue: number;
  totalCommissionsPaidOrAccrued: number;
  commissionToRevenuePercentage: number;
  topCommissionEarners: Array<{
    staffId: string;
    staffName: string;
    role: string;
    totalRevenue: number;
    commissionEarned: number;
    overallTargetPct: number;
  }>;
  pendingPayrollPeriodsCount: number;
  ledgerEntriesCount: number;
}
