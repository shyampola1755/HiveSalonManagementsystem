import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { RbacService } from './rbac.service';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('users')
  getUsers(@Req() req: any) {
    const orgId = req.user?.organizationId || 'org_hive_luxury';
    return this.rbacService.getUsers(orgId);
  }

  @Post('users')
  createUser(@Req() req: any, @Body() data: any) {
    const orgId = req.user?.organizationId || 'org_hive_luxury';
    return this.rbacService.createUser(orgId, data);
  }

  @Post('scopes')
  assignScope(@Body() data: any) {
    return this.rbacService.assignScope(data);
  }

  @Get('matrix')
  getMatrix() {
    return this.rbacService.getRolesAndPermissionsMatrix();
  }

  @Get('users/:userId/access')
  getUserAccessOverview(@Param('userId') userId: string) {
    return this.rbacService.getUserAccessOverview(userId);
  }
}
