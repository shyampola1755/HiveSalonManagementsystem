import { z } from 'zod';

export const ExpenseCategoryEnum = z.enum([
  'RENT',
  'ELECTRICITY',
  'SALARY',
  'SUPPLIES',
  'MARKETING',
  'MAINTENANCE',
  'EQUIPMENT',
  'SOFTWARE',
  'OTHER',
]);

export const ExpenseStatusEnum = z.enum([
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'PAID',
  'CANCELLED',
]);

export const FinancialPeriodStatusEnum = z.enum(['OPEN', 'CLOSED', 'LOCKED']);

export const ReportTypeEnum = z.enum([
  'SALES',
  'CUSTOMERS',
  'APPOINTMENTS',
  'STAFF',
  'INVENTORY',
  'FINANCE',
  'MEMBERSHIP',
  'MARKETING',
]);

export const ExportFormatEnum = z.enum(['CSV', 'EXCEL', 'PDF']);

export const FinancialPaymentMethodEnum = z.enum([
  'UPI',
  'BANK_TRANSFER',
  'CREDIT_CARD',
  'CASH',
  'CHEQUE',
  'PETTY_CASH',
  'WALLET',
  'SPLIT',
]);

// -----------------------------------------------------------------------------
// SCHEMAS
// -----------------------------------------------------------------------------

export const CreateExpenseSchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
  category: ExpenseCategoryEnum,
  vendorName: z.string().min(2, 'Vendor name is required'),
  invoiceNumber: z.string().optional(),
  amount: z.number().positive('Expense amount must be greater than 0'),
  taxAmount: z.number().min(0).optional(),
  totalAmount: z.number().positive().optional(),
  expenseDate: z.string().min(1, 'Expense date is required'),
  dueDate: z.string().optional(),
  paymentMethod: FinancialPaymentMethodEnum.optional(),
  description: z.string().optional(),
  receiptUrl: z.string().url().optional().or(z.literal('')),
  submittedByName: z.string().optional(),
});

export const SubmitExpenseSchema = z.object({
  expenseId: z.string().min(1, 'Expense ID is required'),
  submittedById: z.string().optional(),
  submittedByName: z.string().optional(),
});

export const ApproveExpenseSchema = z.object({
  expenseId: z.string().min(1, 'Expense ID is required'),
  approvedById: z.string().optional(),
  approvedByName: z.string().optional(),
});

export const RejectExpenseSchema = z.object({
  expenseId: z.string().min(1, 'Expense ID is required'),
  rejectedReason: z.string().min(3, 'Rejection reason is required'),
});

export const PayExpenseSchema = z.object({
  expenseId: z.string().min(1, 'Expense ID is required'),
  paymentMethod: FinancialPaymentMethodEnum,
  paidReference: z.string().optional(),
  paidDate: z.string().optional(),
});

export const ReportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  stateId: z.string().optional(),
  districtId: z.string().optional(),
  cityId: z.string().optional(),
  branchId: z.string().optional(),
  serviceId: z.string().optional(),
  staffId: z.string().optional(),
  paymentMethod: z.string().optional(),
  category: ExpenseCategoryEnum.optional(),
});

export const ExportReportSchema = z.object({
  reportType: ReportTypeEnum,
  format: ExportFormatEnum,
  filters: ReportFilterSchema.optional(),
});
