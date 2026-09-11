import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';
import { PermissionsGuard, RequirePermissions } from '../../common/guards/permissions.guard';
import { PERMISSION_FLAGS } from '@hive/config';
import type { ServiceWizardPayload } from '@hive/types';

@Controller('api/v1/services')
@UseGuards(TenantGuard, ScopeGuard, PermissionsGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('categories')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_VIEW)
  async getCategories(
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const categories = await this.serviceService.getCategories(orgId);
    return {
      success: true,
      count: categories.length,
      data: categories,
    };
  }

  @Post('categories')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_CREATE)
  async createCategory(
    @Body() payload: { name: string; description?: string; icon?: string; color?: string },
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const category = await this.serviceService.createCategory(orgId, payload);
    return {
      success: true,
      message: 'Category created successfully.',
      data: category,
    };
  }

  @Get()
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_VIEW)
  async getServices(
    @Query('branchId') branchId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const services = await this.serviceService.getServices(branchId, categoryId, search, orgId);
    return {
      success: true,
      count: services.length,
      data: services,
    };
  }

  @Get('metadata/branches-and-staff')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_VIEW)
  async getBranchesAndStaff(
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const metadata = await this.serviceService.getBranchesAndStaff(orgId);
    return {
      success: true,
      data: metadata,
    };
  }

  @Get(':id')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_VIEW)
  async getServiceById(
    @Param('id') id: string,
    @Query('branchId') branchId?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const service = await this.serviceService.getServiceById(id, branchId, orgId);
    return {
      success: true,
      data: service,
    };
  }

  @Post()
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_CREATE)
  async createService(
    @Body() payload: ServiceWizardPayload,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const service = await this.serviceService.createService(orgId, payload);
    return {
      success: true,
      message: 'Service registered and catalog updated successfully.',
      data: service,
    };
  }

  @Put(':id')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_EDIT)
  async updateService(
    @Param('id') id: string,
    @Body() payload: any,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const service = await this.serviceService.updateService(id, orgId, payload);
    return {
      success: true,
      message: 'Service updated successfully.',
      data: service,
    };
  }

  @Delete(':id')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_DELETE)
  async deleteService(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const res = await this.serviceService.deleteService(id, orgId);
    return res;
  }

  @Post(':id/addons')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_EDIT)
  async addAddon(
    @Param('id') id: string,
    @Body() payload: { name: string; description?: string; durationMinutes?: number; price: number }
  ) {
    const addon = await this.serviceService.addAddon(id, payload);
    return {
      success: true,
      message: 'Add-on option added to service.',
      data: addon,
    };
  }

  @Delete(':id/addons/:addonId')
  @RequirePermissions(PERMISSION_FLAGS.SERVICES_EDIT)
  async deleteAddon(
    @Param('id') id: string,
    @Param('addonId') addonId: string
  ) {
    const res = await this.serviceService.deleteAddon(id, addonId);
    return res;
  }
}
