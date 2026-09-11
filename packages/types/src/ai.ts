/**
 * Hive Salon AI — Business Intelligence, Text-to-SQL & Predictive Analytics Types
 */

export type AIQueryIntent =
  | 'REVENUE_ANALYSIS'
  | 'BRANCH_PERFORMANCE'
  | 'STAFF_PRODUCTIVITY'
  | 'SERVICE_POPULARITY'
  | 'INVENTORY_LEVELS'
  | 'CUSTOMER_CHURN_RETENTION'
  | 'FORECASTING'
  | 'EXPENSE_MARGIN'
  | 'CUSTOM_ANALYTICS';

export type AIChartType = 'BAR' | 'LINE' | 'PIE' | 'DONUT' | 'AREA' | 'TABLE' | 'KPI_CARD';

export interface AISecurityContext {
  organizationId: string;
  stateId?: string;
  districtId?: string;
  cityId?: string;
  branchId?: string;
  role: string;
  permissions: string[];
  userId: string;
  userEmail: string;
}

export interface AIKpiMetric {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

export interface AIChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface AIChartConfig {
  type: AIChartType;
  title: string;
  subtitle?: string;
  xAxisLabels: string[];
  datasets: AIChartDataset[];
  unitPrefix?: string;
  unitSuffix?: string;
}

export interface AITableColumn {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  isCurrency?: boolean;
}

export interface AITableConfig {
  columns: AITableColumn[];
  rows: Record<string, any>[];
  totalRowCount: number;
}

export interface AIQueryResult {
  queryId: string;
  question: string;
  intent: AIQueryIntent;
  executiveSummary: string;
  kpis: AIKpiMetric[];
  chart?: AIChartConfig;
  table?: AITableConfig;
  generatedSql: string;
  sanitizedSqlForDisplay: string;
  executionTimeMs: number;
  securityScopeApplied: {
    organizationId: string;
    branchScope: string;
    role: string;
    isRestricted: boolean;
  };
  suggestedFollowUps: string[];
  timestamp: string;
}

export interface AIQueryRequest {
  question: string;
  securityContext?: Partial<AISecurityContext>;
  preferredChartType?: AIChartType;
}

// -----------------------------------------------------------------------------
// PREDICTIVE FORECASTING MODELS
// -----------------------------------------------------------------------------

export interface RevenueForecastPoint {
  date: string;
  baseline: number;
  optimistic: number;
  conservative: number;
  isHistorical?: boolean;
}

export interface BookingLoadForecastPoint {
  branchName: string;
  predictedAppointments: number;
  predictedOccupancyRate: number; // 0-100%
  peakTimeSlot: string;
  recommendedStaffCount: number;
}

export interface InventoryDepletionPoint {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  dailyBurnRate: number;
  daysUntilStockout: number;
  urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  suggestedReorderQuantity: number;
  estimatedCost: number;
}

export interface CustomerChurnCohortPoint {
  segment: string;
  totalCustomers: number;
  dormantOver60Days: number;
  churnRiskPercentage: number;
  atRiskRevenueValue: number;
  suggestedWinbackCampaign: string;
}

export interface DemandSpikePoint {
  serviceCategory: string;
  dayOfWeek: string;
  timeWindow: string;
  spikeFactor: number; // e.g. 1.8x
  recommendedAction: string;
}

export interface AIForecastSuite {
  revenueForecast: {
    summary: string;
    projectedNext30Days: number;
    projectedGrowthPercentage: number;
    timeSeries: RevenueForecastPoint[];
  };
  bookingForecast: {
    summary: string;
    projectedTotalBookings: number;
    averageOccupancyRate: number;
    branchBreakdown: BookingLoadForecastPoint[];
  };
  inventoryForecast: {
    summary: string;
    criticalStockoutCount: number;
    totalCapitalAtRisk: number;
    items: InventoryDepletionPoint[];
  };
  churnForecast: {
    summary: string;
    totalAtRiskCustomers: number;
    potentialRevenueLoss: number;
    cohorts: CustomerChurnCohortPoint[];
  };
  demandForecast: {
    summary: string;
    peakSurgeDays: string[];
    spikes: DemandSpikePoint[];
  };
}

// -----------------------------------------------------------------------------
// AUTOMATED STRATEGIC INSIGHTS
// -----------------------------------------------------------------------------

export type AIInsightCategory =
  | 'GROWTH'
  | 'LOW_PERFORMING_SERVICE'
  | 'INVENTORY_CONCERN'
  | 'CUSTOMER_RETENTION'
  | 'STAFF_ANOMALY';

export type AIInsightSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: AIInsightCategory;
  severity: AIInsightSeverity;
  metricImpact: string;
  estimatedFinancialGain: number;
  recommendedAction: string;
  branchScope?: string;
  isActionable: boolean;
  actionEndpoint?: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// AI AUDIT LOGGING
// -----------------------------------------------------------------------------

export interface AIAuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  branchId?: string;
  branchName?: string;
  question: string;
  intent: AIQueryIntent;
  generatedSql: string;
  executionTimeMs: number;
  rowCount: number;
  status: 'SUCCESS' | 'REJECTED_SECURITY' | 'ERROR';
  errorMessage?: string;
  securityContext: {
    organizationId: string;
    branchId?: string;
    role: string;
    permissions: string[];
  };
  createdAt: string;
}
