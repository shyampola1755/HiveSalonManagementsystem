import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';
import { PermissionsGuard, RequirePermissions } from '../../common/guards/permissions.guard';
import { PERMISSION_FLAGS } from '@hive/config';
import type {
  CreateAppointmentDto,
  CreateWalkInDto,
  RescheduleAppointmentDto,
  CheckInDto,
  AppointmentStatus,
  QueueStatus,
} from '@hive/types';

@Controller('api/v1/appointments')
@UseGuards(TenantGuard, ScopeGuard, PermissionsGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_VIEW)
  async getAppointments(
    @Query('branchId') branchId?: string,
    @Query('staffId') staffId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const data = await this.appointmentService.getAppointments(orgId, {
      branchId,
      staffId,
      status,
      date,
      search,
    });
    return {
      success: true,
      count: data.length,
      data,
    };
  }

  @Get('queue/live')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_VIEW)
  async getLiveQueue(
    @Query('branchId') branchId?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const queue = await this.appointmentService.getLiveQueue(orgId, branchId);
    return {
      success: true,
      count: queue.length,
      data: queue,
    };
  }

  @Get('validate/collision')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_VIEW)
  async validateCollision(
    @Query('staffId') staffId: string,
    @Query('branchId') branchId: string,
    @Query('startTime') startTime: string,
    @Query('durationMinutes') durationMinutes: string,
    @Query('bufferMinutes') bufferMinutes?: string,
    @Query('excludeAppointmentId') excludeAppointmentId?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const result = await this.appointmentService.checkCollision(
      orgId,
      staffId,
      branchId,
      startTime,
      Number(durationMinutes) || 45,
      Number(bufferMinutes) || 15,
      excludeAppointmentId
    );
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_VIEW)
  async getAppointmentById(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const apt = await this.appointmentService.getAppointmentById(orgId, id);
    return {
      success: true,
      data: apt,
    };
  }

  @Post()
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_CREATE)
  async createAppointment(
    @Body() payload: CreateAppointmentDto,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const created = await this.appointmentService.createAppointment(orgId, payload);
    return {
      success: true,
      message: `Appointment ${created.appointmentNumber} created successfully.`,
      data: created,
    };
  }

  @Post('walk-in')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_CREATE)
  async createWalkIn(
    @Body() payload: CreateWalkInDto,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const walkIn = await this.appointmentService.createWalkIn(orgId, payload);
    return {
      success: true,
      message: `Walk-in token ${walkIn.queueToken} generated and placed in queue.`,
      data: walkIn,
    };
  }

  @Post(':id/check-in')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_EDIT)
  async checkInCustomer(
    @Param('id') id: string,
    @Body() body: { chairNumber?: string; notes?: string },
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const updated = await this.appointmentService.checkInCustomer(orgId, {
      appointmentId: id,
      ...body,
    });
    return {
      success: true,
      message: `Customer marked as ARRIVED for appointment ${updated.appointmentNumber}.`,
      data: updated,
    };
  }

  @Put(':id/reschedule')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_EDIT)
  async rescheduleAppointment(
    @Param('id') id: string,
    @Body() payload: RescheduleAppointmentDto,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const updated = await this.appointmentService.rescheduleAppointment(orgId, id, payload);
    return {
      success: true,
      message: `Appointment rescheduled to ${new Date(updated.startTime).toLocaleString()}.`,
      data: updated,
    };
  }

  @Put(':id/status')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_EDIT)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: AppointmentStatus; cancellationReason?: string },
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const updated = await this.appointmentService.updateStatus(
      orgId,
      id,
      body.status,
      body.cancellationReason
    );
    return {
      success: true,
      message: `Appointment status updated to ${body.status}.`,
      data: updated,
    };
  }

  @Put('queue/:id/transition')
  @RequirePermissions(PERMISSION_FLAGS.APPOINTMENTS_EDIT)
  async transitionQueueStage(
    @Param('id') id: string,
    @Body() body: { status: QueueStatus; chairNumber?: string },
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const updated = await this.appointmentService.transitionQueueStage(
      orgId,
      id,
      body.status,
      body.chairNumber
    );
    return {
      success: true,
      message: `Queue stage transitioned to ${body.status}.`,
      data: updated,
    };
  }
}
