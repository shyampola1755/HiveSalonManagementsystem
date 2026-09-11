import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HierarchyService } from './hierarchy.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';

@Controller('hierarchy')
export class HierarchyController {
  constructor(private readonly hierarchyService: HierarchyService) {}

  @Get('tree')
  getTree(@Req() req: any) {
    const orgId = req.user?.organizationId || 'org_hive_luxury';
    return {
      country: 'India',
      states: this.hierarchyService.getHierarchyTree(orgId),
    };
  }

  @Get('states')
  getStates(@Req() req: any) {
    const orgId = req.user?.organizationId || 'org_hive_luxury';
    return this.hierarchyService.getStates(orgId);
  }

  @Post('states')
  createState(@Req() req: any, @Body() data: any) {
    const orgId = req.user?.organizationId || 'org_hive_luxury';
    return this.hierarchyService.createState(orgId, data);
  }

  @Get('districts')
  getDistricts(@Query('stateId') stateId?: string) {
    return this.hierarchyService.getDistricts(stateId);
  }

  @Get('cities')
  getCities(@Query('districtId') districtId?: string) {
    return this.hierarchyService.getCities(districtId);
  }

  @Get('branches')
  getBranches(@Req() req: any) {
    const orgId = req.user?.organizationId || 'org_hive_luxury';
    return this.hierarchyService.getBranches(orgId);
  }

  @Get('branches/:branchId')
  @UseGuards(ScopeGuard)
  getBranchById(@Param('branchId') branchId: string) {
    return this.hierarchyService.getBranchById(branchId);
  }

  @Post('branches')
  createBranch(@Req() req: any, @Body() data: any) {
    const orgId = req.user?.organizationId || 'org_hive_luxury';
    return this.hierarchyService.createBranch(orgId, data);
  }
}
