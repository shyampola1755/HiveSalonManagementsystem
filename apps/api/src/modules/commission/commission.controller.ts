import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CommissionService } from './commission.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';
import { PermissionsGuard, RequirePermissions } from '../../common/guards/permissions.guard';
import { PERMISSION_FLAGS } from '@hive/config';
import type {
  CreateCommissionPlanDto,
  UpdateCommissionPlanDto,
  ManualLedgerAdjustmentPayload,
  UpdateStaffTargetDto,
  CreatePayrollPeriodDto,
  PayrollAdjustmentDto,
  CommissionSimulationRequest,
  CommissionLedgerStatus,
} from '@hive/types';

@Controller('api/v1/commissions')
@UseGuards(TenantGuard, ScopeGuard, PermissionsGuard)
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  // ---------------------------------------------------------------------------
  // 1. DASHBOARDS & SUMMARIES
  // ---------------------------------------------------------------------------
  @Get('overview')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getStaffCommissionOverview(
    @Query('staffId') staffId?: string,
    @Query('periodMonth') periodMonth?: string
  ) {
    const targetStaffId = staffId || 'st-1';
    const month = periodMonth || '2026-09';
    const overview = await this.commissionService.getStaffCommissionOverview(targetStaffId, month);
    return {
      success: true,
      data: overview,
    };
  }

  @Get('analytics')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getManagerCommissionAnalytics(
    @Query('branchId') branchId?: string,
    @Query('periodMonth') periodMonth?: string
  ) {
    const month = periodMonth || '2026-09';
    const analytics = await this.commissionService.getManagerCommissionAnalytics(branchId, month);
    return {
      success: true,
      data: analytics,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. COMMISSION PLANS CRUD
  // ---------------------------------------------------------------------------
  @Get('plans')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getAllCommissionPlans() {
    const plans = await this.commissionService.getAllCommissionPlans();
    return {
      success: true,
      count: plans.length,
      data: plans,
    };
  }

  @Get('plans/:id')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getCommissionPlanById(@Param('id') id: string) {
    const plan = await this.commissionService.getCommissionPlanById(id);
    return {
      success: true,
      data: plan,
    };
  }

  @Post('plans')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async createCommissionPlan(
    @Body() dto: CreateCommissionPlanDto,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const plan = await this.commissionService.createCommissionPlan(dto, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: `Commission plan "${plan.name}" created successfully.`,
      data: plan,
    };
  }

  @Put('plans/:id')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async updateCommissionPlan(
    @Param('id') id: string,
    @Body() dto: UpdateCommissionPlanDto
  ) {
    const plan = await this.commissionService.updateCommissionPlan(id, dto);
    return {
      success: true,
      message: `Commission plan "${plan.name}" updated successfully.`,
      data: plan,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. IMMUTABLE COMMISSION LEDGER & DOUBLE-ENTRY RECORDS
  // ---------------------------------------------------------------------------
  @Get('ledger')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getCommissionLedger(
    @Query('branchId') branchId?: string,
    @Query('staffId') staffId?: string,
    @Query('status') status?: CommissionLedgerStatus,
    @Query('lineItemType') lineItemType?: string
  ) {
    const ledger = await this.commissionService.getCommissionLedger({
      branchId,
      staffId,
      status,
      lineItemType,
    });
    return {
      success: true,
      count: ledger.length,
      data: ledger,
    };
  }

  @Post('ledger/adjust')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async recordManualAdjustment(
    @Body() payload: ManualLedgerAdjustmentPayload,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const entry = await this.commissionService.recordManualAdjustment(payload, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: 'Commission ledger manual adjustment recorded.',
      data: entry,
    };
  }

  // ---------------------------------------------------------------------------
  // 4. 7-DIMENSIONAL STAFF TARGETS
  // ---------------------------------------------------------------------------
  @Get('targets')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getStaffTargets(
    @Query('branchId') branchId?: string,
    @Query('periodMonth') periodMonth?: string
  ) {
    const targets = await this.commissionService.getStaffTargets(branchId, periodMonth || '2026-09');
    return {
      success: true,
      count: targets.length,
      data: targets,
    };
  }

  @Put('targets/:staffId')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async updateStaffTarget(
    @Param('staffId') staffId: string,
    @Body() dto: UpdateStaffTargetDto
  ) {
    const updated = await this.commissionService.updateStaffTarget(staffId, dto);
    return {
      success: true,
      message: `Target goals updated for ${updated.staffName}.`,
      data: updated,
    };
  }

  // ---------------------------------------------------------------------------
  // 5. PAYROLL PERIODS & EXPORTS
  // ---------------------------------------------------------------------------
  @Get('payroll')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getPayrollPeriods(@Query('branchId') branchId?: string) {
    const periods = await this.commissionService.getPayrollPeriods(branchId);
    return {
      success: true,
      count: periods.length,
      data: periods,
    };
  }

  @Get('payroll/:id')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async getPayrollPeriodById(@Param('id') id: string) {
    const period = await this.commissionService.getPayrollPeriodById(id);
    return {
      success: true,
      data: period,
    };
  }

  @Post('payroll/generate')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async generatePayrollPeriod(
    @Body() dto: CreatePayrollPeriodDto,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const period = await this.commissionService.generatePayrollPeriod(dto, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: `Payroll summary for ${period.periodMonth} compiled successfully.`,
      data: period,
    };
  }

  @Post('payroll/adjust')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async applyPayrollAdjustment(@Body() dto: PayrollAdjustmentDto) {
    const line = await this.commissionService.applyPayrollAdjustment(dto);
    return {
      success: true,
      message: `Adjustment applied to ${line.staffName}'s payroll line.`,
      data: line,
    };
  }

  @Patch('payroll/:id/approve')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async approvePayrollPeriod(@Param('id') id: string) {
    const period = await this.commissionService.approvePayrollPeriod(id);
    return {
      success: true,
      message: `Payroll period ${period.periodMonth} approved for disbursement.`,
      data: period,
    };
  }

  @Get('payroll/:id/export')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  async exportPayroll(@Param('id') id: string) {
    const exportData = await this.commissionService.exportPayroll(id);
    return {
      success: true,
      data: exportData,
    };
  }

  // ---------------------------------------------------------------------------
  // 6. INTERACTIVE SIMULATION SANDBOX
  // ---------------------------------------------------------------------------
  @Post('simulate')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_COMMISSION)
  simulateCommission(@Body() request: CommissionSimulationRequest) {
    const result = this.commissionService.simulateCommission(request);
    return {
      success: true,
      data: result,
    };
  }
}
