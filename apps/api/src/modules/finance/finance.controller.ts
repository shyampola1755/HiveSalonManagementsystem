import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import type {
  CreateExpensePayload,
  SubmitExpensePayload,
  ApproveExpensePayload,
  RejectExpensePayload,
  PayExpensePayload,
  ExportReportPayload,
  ReportFilterPayload,
} from '@hive/types';

@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ---------------------------------------------------------------------------
  // 1. REVENUE & FINANCIAL SUMMARIES
  // ---------------------------------------------------------------------------
  @Get('summary')
  getFinancialSummary(@Query('branchId') branchId?: string) {
    return this.financeService.getFinancialSummary(branchId);
  }

  @Get('revenue-breakdown')
  getRevenueBreakdown(@Query('branchId') branchId?: string) {
    return this.financeService.getRevenueBreakdown(branchId);
  }

  @Get('pnl')
  getProfitAndLoss(@Query('branchId') branchId?: string) {
    return this.financeService.getProfitAndLossStatement(branchId);
  }

  // ---------------------------------------------------------------------------
  // 2. EXPENSES & 4-STAGE APPROVAL WORKFLOW
  // ---------------------------------------------------------------------------
  @Get('expenses')
  getExpenses(@Query() filters?: ReportFilterPayload) {
    return this.financeService.getAllExpenses(filters);
  }

  @Post('expenses/draft')
  @HttpCode(HttpStatus.CREATED)
  createExpenseDraft(@Body() payload: CreateExpensePayload) {
    return this.financeService.createExpenseDraft(payload);
  }

  @Post('expenses/:id/submit')
  submitExpense(
    @Param('id') id: string,
    @Body() payload: Omit<SubmitExpensePayload, 'expenseId'>
  ) {
    return this.financeService.submitExpense({
      ...payload,
      expenseId: id,
    });
  }

  @Post('expenses/:id/approve')
  approveExpense(
    @Param('id') id: string,
    @Body() payload: Omit<ApproveExpensePayload, 'expenseId'>
  ) {
    return this.financeService.approveExpense({
      ...payload,
      expenseId: id,
    });
  }

  @Post('expenses/:id/reject')
  rejectExpense(
    @Param('id') id: string,
    @Body() payload: Omit<RejectExpensePayload, 'expenseId'>
  ) {
    return this.financeService.rejectExpense({
      ...payload,
      expenseId: id,
    });
  }

  @Post('expenses/:id/pay')
  recordPayment(
    @Param('id') id: string,
    @Body() payload: Omit<PayExpensePayload, 'expenseId'>
  ) {
    return this.financeService.recordExpensePayment({
      ...payload,
      expenseId: id,
    });
  }

  // ---------------------------------------------------------------------------
  // 3. HIERARCHY ROLLUP & BRANCH COMPARISON
  // ---------------------------------------------------------------------------
  @Get('hierarchy-rollup')
  getHierarchicalRollup() {
    return this.financeService.getHierarchicalRollup();
  }

  @Get('branch-comparison')
  getBranchComparison() {
    return this.financeService.getBranchComparisonMatrix();
  }

  // ---------------------------------------------------------------------------
  // 4. 8 REPORT SUITES
  // ---------------------------------------------------------------------------
  @Get('reports/sales')
  getSalesReport(@Query() filters?: ReportFilterPayload) {
    return this.financeService.getSalesReport(filters);
  }

  @Get('reports/customers')
  getCustomerReport() {
    return this.financeService.getCustomerAnalyticsReport();
  }

  @Get('reports/appointments')
  getAppointmentReport() {
    return this.financeService.getAppointmentReport();
  }

  @Get('reports/staff')
  getStaffReport() {
    return this.financeService.getStaffProductivityReport();
  }

  @Get('reports/inventory')
  getInventoryReport() {
    return this.financeService.getInventoryFinanceReport();
  }

  @Get('reports/membership')
  getMembershipReport() {
    return this.financeService.getMembershipFinanceReport();
  }

  @Get('reports/marketing')
  getMarketingReport() {
    return this.financeService.getMarketingRoiReport();
  }

  // ---------------------------------------------------------------------------
  // 5. EXPORT ENGINE
  // ---------------------------------------------------------------------------
  @Post('reports/export')
  @HttpCode(HttpStatus.OK)
  generateExport(@Body() payload: ExportReportPayload) {
    return this.financeService.generateReportExport(payload);
  }

  // ---------------------------------------------------------------------------
  // 6. FINANCIAL PERIODS
  // ---------------------------------------------------------------------------
  @Get('periods')
  getFinancialPeriods() {
    return this.financeService.getAllFinancialPeriods();
  }

  @Post('periods/:id/lock')
  lockPeriod(
    @Param('id') id: string,
    @Body('lockedById') lockedById: string,
    @Body('lockedByName') lockedByName: string
  ) {
    return this.financeService.lockFinancialPeriod(id, lockedById, lockedByName);
  }
}
