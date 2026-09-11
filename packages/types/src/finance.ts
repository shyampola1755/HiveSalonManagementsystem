// -----------------------------------------------------------------------------
// HIVE SALON — PHASE 13: FINANCE, EXPENSES, REPORTING & CENTRALIZED MANAGEMENT
// -----------------------------------------------------------------------------

export type ExpenseCategory =
  | 'RENT'
  | 'ELECTRICITY'
  | 'SALARY'
  | 'SUPPLIES'
  | 'MARKETING'
  | 'MAINTENANCE'
  | 'EQUIPMENT'
  | 'SOFTWARE'
  | 'OTHER';

export type ExpenseStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'CANCELLED';

export type FinancialPeriodStatus = 'OPEN' | 'CLOSED' | 'LOCKED';

export type ReportType =
  | 'SALES'
  | 'CUSTOMERS'
  | 'APPOINTMENTS'
  | 'STAFF'
  | 'INVENTORY'
  | 'FINANCE'
  | 'MEMBERSHIP'
  | 'MARKETING';

export type ExportFormat = 'CSV' | 'EXCEL' | 'PDF';

export type FinancialPaymentMethod =
  | 'UPI'
  | 'BANK_TRANSFER'
  | 'CREDIT_CARD'
  | 'CASH'
  | 'CHEQUE'
  | 'PETTY_CASH'
  | 'WALLET'
  | 'SPLIT';

// -----------------------------------------------------------------------------
// DTOS
// -----------------------------------------------------------------------------

export interface ExpenseDto {
  id: string;
  organizationId: string;
  branchId: string;
  branchName?: string;
  category: ExpenseCategory;
  vendorName: string;
  invoiceNumber?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  expenseDate: string;
  dueDate?: string;
  paidDate?: string;
  paymentMethod?: FinancialPaymentMethod;
  description?: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  submittedById?: string;
  submittedByName?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectedReason?: string;
  paidReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialPeriodDto {
  id: string;
  organizationId: string;
  branchId?: string;
  branchName?: string;
  fiscalYear: string;
  month: number;
  monthName: string;
  quarter: string;
  status: FinancialPeriodStatus;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  lockedById?: string;
  lockedByName?: string;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummaryDto {
  totalRevenue: number;
  totalExpenses: number;
  netOperatingResult: number;
  ebitdaMarginPercentage: number;
  totalCollections: number;
  totalRefunds: number;
  totalOutstanding: number;
  cogsAmount: number;
  grossMarginPercentage: number;
  monthOverMonthGrowth: number;
}

export interface RevenueStreamBreakdownDto {
  serviceRevenue: number;
  retailRevenue: number;
  membershipRevenue: number;
  packageRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  servicePercentage: number;
  retailPercentage: number;
  membershipPercentage: number;
  packagePercentage: number;
  otherPercentage: number;
}

export interface ProfitAndLossStatementDto {
  period: string;
  revenue: RevenueStreamBreakdownDto;
  cogs: number;
  grossProfit: number;
  grossMarginPercentage: number;
  operatingExpenses: {
    rent: number;
    electricity: number;
    salary: number;
    supplies: number;
    marketing: number;
    maintenance: number;
    equipment: number;
    software: number;
    other: number;
    total: number;
  };
  operatingProfit: number;
  operatingMarginPercentage: number;
  tax: number;
  netProfit: number;
  netMarginPercentage: number;
}

export interface BranchComparisonMetricDto {
  branchId: string;
  branchName: string;
  cityName: string;
  stateName: string;
  revenue: number;
  revenueGrowthMoM: number;
  totalCustomers: number;
  newCustomers: number;
  averageTicketSize: number;
  servicesCount: number;
  retailUnitsSold: number;
  membershipsSold: number;
  activeStaffCount: number;
  revenuePerStaff: number;
  expenses: number;
  netProfit: number;
  rank: number;
}

export interface HierarchicalFinancialNodeDto {
  id: string;
  name: string;
  code: string;
  type: 'ORGANIZATION' | 'STATE' | 'DISTRICT' | 'CITY' | 'BRANCH';
  revenue: number;
  expenses: number;
  netProfit: number;
  collections: number;
  growthRate: number;
  children?: HierarchicalFinancialNodeDto[];
}

// -----------------------------------------------------------------------------
// 8 REPORT SUITES DTOS
// -----------------------------------------------------------------------------

export interface SalesReportRowDto {
  date: string;
  invoiceNumber: string;
  branchName: string;
  customerName: string;
  serviceTotal: number;
  retailTotal: number;
  membershipTotal: number;
  discountTotal: number;
  taxTotal: number;
  netAmount: number;
  paymentMethod: string;
  status: string;
}

export interface CustomerAnalyticsReportDto {
  totalCustomers: number;
  newCustomersThisMonth: number;
  returningCustomers: number;
  vipCustomers: number;
  inactiveCustomers: number;
  averageCustomerLifetimeValue: number;
  churnRatePercentage: number;
  acquisitionChannels: { channel: string; count: number; percentage: number }[];
}

export interface AppointmentReportDto {
  totalBooked: number;
  totalCompleted: number;
  totalCancelled: number;
  totalNoShow: number;
  completionRatePercentage: number;
  averageServiceDurationMinutes: number;
  chairOccupancyRatePercentage: number;
  peakBookingHours: { hour: string; count: number }[];
}

export interface StaffProductivityReportRowDto {
  staffId: string;
  staffName: string;
  role: string;
  branchName: string;
  servicesCompleted: number;
  serviceRevenue: number;
  retailSales: number;
  totalRevenue: number;
  averageTicketSize: number;
  targetRevenue: number;
  targetAchievementPercentage: number;
  commissionEarned: number;
  customerRating: number;
}

export interface InventoryFinanceReportDto {
  totalStockValuationCost: number;
  totalStockValuationRetail: number;
  cogsThisMonth: number;
  stockShrinkageAndDamage: number;
  lowStockItemsCount: number;
  reorderPendingValue: number;
  fastMovingProducts: { productName: string; unitsSold: number; revenue: number }[];
}

export interface MembershipFinanceReportDto {
  activeSubscribersCount: number;
  newEnrollmentsThisMonth: number;
  monthlyRecurringRevenue: number;
  packageSessionsLiabilityTotal: number;
  prepaidWalletFloatLiability: number;
  loyaltyPointsLiabilityRupees: number;
  retentionRenewalRatePercentage: number;
}

export interface MarketingRoiReportDto {
  campaignsExecuted: number;
  totalCampaignSpend: number;
  messagesDispatched: number;
  leadsConverted: number;
  revenueGenerated: number;
  roiMultiplier: number;
  averageCustomerAcquisitionCost: number;
  topPerformingCampaign: string;
}

// -----------------------------------------------------------------------------
// PAYLOADS
// -----------------------------------------------------------------------------

export interface CreateExpensePayload {
  branchId: string;
  category: ExpenseCategory;
  vendorName: string;
  invoiceNumber?: string;
  amount: number;
  taxAmount?: number;
  totalAmount?: number;
  expenseDate: string;
  dueDate?: string;
  paymentMethod?: FinancialPaymentMethod;
  description?: string;
  receiptUrl?: string;
  submittedByName?: string;
}

export interface SubmitExpensePayload {
  expenseId: string;
  submittedById?: string;
  submittedByName?: string;
}

export interface ApproveExpensePayload {
  expenseId: string;
  approvedById?: string;
  approvedByName?: string;
}

export interface RejectExpensePayload {
  expenseId: string;
  rejectedReason: string;
}

export interface PayExpensePayload {
  expenseId: string;
  paymentMethod: FinancialPaymentMethod;
  paidReference?: string;
  paidDate?: string;
}

export interface ReportFilterPayload {
  startDate?: string;
  endDate?: string;
  stateId?: string;
  districtId?: string;
  cityId?: string;
  branchId?: string;
  serviceId?: string;
  staffId?: string;
  paymentMethod?: string;
  category?: ExpenseCategory;
}

export interface ExportReportPayload {
  reportType: ReportType;
  format: ExportFormat;
  filters?: ReportFilterPayload;
}
