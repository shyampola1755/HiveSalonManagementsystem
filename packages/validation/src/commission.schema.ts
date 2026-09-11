import { z } from 'zod';

export const commissionTierSlabSchema = z.object({
  slabOrder: z.number().int().min(1),
  minRevenue: z.number().min(0, 'Minimum revenue must be non-negative'),
  maxRevenue: z.number().min(0).nullable().optional(),
  commissionPercentage: z.number().min(0).max(100, 'Commission percentage must be between 0 and 100'),
  bonusFixedAmount: z.number().min(0).optional().default(0),
});

export const createCommissionPlanSchema = z.object({
  name: z.string().min(2, 'Plan name must have at least 2 characters').max(100),
  code: z.string().min(2, 'Plan code must have at least 2 characters').max(50),
  description: z.string().max(500).optional(),
  planType: z.enum(['PERCENTAGE', 'FIXED', 'TIERED', 'TARGET_ACCELERATOR']),
  serviceCommissionRate: z.number().min(0).max(100).optional().default(10),
  retailCommissionRate: z.number().min(0).max(100).optional().default(5),
  fixedServiceFee: z.number().min(0).optional().default(0),
  targetBonusRate: z.number().min(0).max(50).optional().default(2),
  branchId: z.string().optional(),
  tierSlabs: z.array(commissionTierSlabSchema).optional().default([]),
});

export const updateCommissionPlanSchema = createCommissionPlanSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const manualLedgerAdjustmentSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  amount: z.number().refine((val) => val !== 0, 'Adjustment amount cannot be zero'),
  reason: z.string().min(3, 'Adjustment reason must have at least 3 characters'),
  performedByName: z.string().optional(),
});

export const updateStaffTargetSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  periodMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Period month must be YYYY-MM format'),
  revenueTarget: z.number().min(0).optional(),
  servicesTarget: z.number().int().min(0).optional(),
  retailTarget: z.number().min(0).optional(),
  membershipTarget: z.number().int().min(0).optional(),
  newCustomersTarget: z.number().int().min(0).optional(),
  rebookingTargetPercentage: z.number().min(0).max(100).optional(),
  ratingTarget: z.number().min(1.0).max(5.0).optional(),
});

export const createPayrollPeriodSchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
  periodMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Period month must be YYYY-MM format'),
  notes: z.string().max(500).optional(),
});

export const payrollAdjustmentSchema = z.object({
  payrollStaffLineId: z.string().min(1, 'Payroll staff line ID is required'),
  adjustmentAmount: z.number().refine((val) => val !== 0, 'Adjustment amount cannot be zero'),
  reason: z.string().min(3, 'Reason must have at least 3 characters'),
});

export const commissionSimulationSchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
  currentMonthRevenue: z.number().min(0).default(0),
  planId: z.string().optional(),
  lineItems: z.array(
    z.object({
      itemType: z.enum(['SERVICE', 'RETAIL']),
      name: z.string().min(1),
      price: z.number().min(0),
      staffId: z.string().min(1),
      staffName: z.string().min(1),
      customCommissionRate: z.number().min(0).max(100).optional(),
    })
  ).min(1, 'At least one line item is required for simulation'),
  isRefundSimulation: z.boolean().optional().default(false),
  refundPercentage: z.number().min(1).max(100).optional().default(100),
});
