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
import { StaffService } from './staff.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';
import { PermissionsGuard, RequirePermissions } from '../../common/guards/permissions.guard';
import { PERMISSION_FLAGS } from '@hive/config';
import type {
  CreateStaffDto,
  UpdateStaffDto,
  CreateShiftTemplateDto,
  RosterAssignmentPayload,
  AttendancePunchPayload,
  ManualAttendancePayload,
  ApplyLeavePayload,
  ReviewLeavePayload,
} from '@hive/types';

@Controller('api/v1/staff')
@UseGuards(TenantGuard, ScopeGuard, PermissionsGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ---------------------------------------------------------------------------
  // 1. DASHBOARD & OVERVIEWS
  // ---------------------------------------------------------------------------
  @Get('dashboard/summary')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getDashboardSummary(@Query('staffId') staffId?: string) {
    // Default to first styler if not passed
    const targetStaffId = staffId || 'st-1';
    const summary = await this.staffService.getStaffDashboardSummary(targetStaffId);
    return {
      success: true,
      data: summary,
    };
  }

  @Get('manager/overview')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getManagerOverview(@Query('branchId') branchId?: string) {
    const overview = await this.staffService.getManagerOverview(branchId);
    return {
      success: true,
      data: overview,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. SHIFT TEMPLATES & ROSTERS
  // ---------------------------------------------------------------------------
  @Get('shifts/templates')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getShiftTemplates() {
    const templates = await this.staffService.getShiftTemplates();
    return {
      success: true,
      count: templates.length,
      data: templates,
    };
  }

  @Post('shifts/templates')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async createShiftTemplate(
    @Body() dto: CreateShiftTemplateDto,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const template = await this.staffService.createShiftTemplate(dto, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: `Shift template "${template.name}" created successfully.`,
      data: template,
    };
  }

  @Get('roster')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getRosterSchedule(
    @Query('branchId') branchId?: string,
    @Query('startDate') startDate?: string
  ) {
    const schedule = await this.staffService.getRosterSchedule(branchId, startDate);
    return {
      success: true,
      count: schedule.length,
      data: schedule,
    };
  }

  @Post('roster')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async assignRosterShift(
    @Body() payload: RosterAssignmentPayload,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const assignment = await this.staffService.assignRosterShift(payload, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: 'Roster shift assigned successfully.',
      data: assignment,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. ATTENDANCE & BIOMETRIC ENGINE
  // ---------------------------------------------------------------------------
  @Get('attendance')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getAttendanceRecords(
    @Query('branchId') branchId?: string,
    @Query('staffId') staffId?: string,
    @Query('date') date?: string
  ) {
    const records = await this.staffService.getAttendanceRecords({
      branchId,
      staffId,
      date,
    });
    return {
      success: true,
      count: records.length,
      data: records,
    };
  }

  @Post('attendance/punch')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_ATTENDANCE)
  async punchAttendance(
    @Body() payload: AttendancePunchPayload,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const record = await this.staffService.punchAttendance(payload, tenantId || 'org_hive_demo');
    const actionLabel =
      payload.action === 'CHECK_IN'
        ? 'Checked In'
        : payload.action === 'CHECK_OUT'
          ? 'Checked Out'
          : payload.action === 'START_BREAK'
            ? 'Started Break'
            : 'Ended Break';

    return {
      success: true,
      message: `Successfully ${actionLabel} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      data: record,
    };
  }

  @Post('attendance/manual')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async recordManualAttendance(
    @Body() payload: ManualAttendancePayload,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const record = await this.staffService.recordManualAttendance(payload, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: 'Manual attendance log saved successfully.',
      data: record,
    };
  }

  // ---------------------------------------------------------------------------
  // 4. LEAVE MANAGEMENT
  // ---------------------------------------------------------------------------
  @Get('leaves')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getAllLeaves(
    @Query('branchId') branchId?: string,
    @Query('staffId') staffId?: string,
    @Query('status') status?: string
  ) {
    const leaves = await this.staffService.getAllLeaves({ branchId, staffId, status });
    return {
      success: true,
      count: leaves.length,
      data: leaves,
    };
  }

  @Post('leaves/apply')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async applyLeave(
    @Body() payload: ApplyLeavePayload,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const leave = await this.staffService.applyLeave(payload, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: 'Leave application submitted successfully for review.',
      data: leave,
    };
  }

  @Patch('leaves/:id/review')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async reviewLeave(
    @Param('id') id: string,
    @Body() payload: ReviewLeavePayload
  ) {
    const leave = await this.staffService.reviewLeave(id, payload);
    return {
      success: true,
      message: `Leave request status updated to ${leave.status}.`,
      data: leave,
    };
  }

  @Get('leaves/balance/:staffId')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getLeaveBalance(@Param('staffId') staffId: string) {
    const balance = await this.staffService.getLeaveBalance(staffId);
    return {
      success: true,
      data: balance,
    };
  }

  // ---------------------------------------------------------------------------
  // 5. STAFF DIRECTORY CRUD (MUST BE LAST TO NOT INTERCEPT STATIC ROUTES)
  // ---------------------------------------------------------------------------
  @Get()
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getAllStaff(
    @Query('branchId') branchId?: string,
    @Query('staffType') staffType?: string,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    const staff = await this.staffService.getAllStaff({
      branchId,
      staffType,
      status,
      search,
    });
    return {
      success: true,
      count: staff.length,
      data: staff,
    };
  }

  @Get(':id')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_VIEW)
  async getStaffById(@Param('id') id: string) {
    const staff = await this.staffService.getStaffById(id);
    return {
      success: true,
      data: staff,
    };
  }

  @Post()
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async createStaff(
    @Body() dto: CreateStaffDto,
    @Headers('x-tenant-id') tenantId?: string
  ) {
    const staff = await this.staffService.createStaff(dto, tenantId || 'org_hive_demo');
    return {
      success: true,
      message: `Staff member "${staff.displayName}" onboarded successfully.`,
      data: staff,
    };
  }

  @Put(':id')
  @RequirePermissions(PERMISSION_FLAGS.STAFF_MANAGE)
  async updateStaff(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto
  ) {
    const staff = await this.staffService.updateStaff(id, dto);
    return {
      success: true,
      message: `Staff profile "${staff.displayName}" updated successfully.`,
      data: staff,
    };
  }
}
