import { Module } from '@nestjs/common';
import { HealthController } from './modules/health/health.controller';
import { SearchController } from './modules/search/search.controller';
import { AuditService } from './modules/audit/audit.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { HierarchyController } from './modules/hierarchy/hierarchy.controller';
import { HierarchyService } from './modules/hierarchy/hierarchy.service';
import { RbacController } from './modules/rbac/rbac.controller';
import { RbacService } from './modules/rbac/rbac.service';
import { CustomerController } from './modules/customer/customer.controller';
import { CustomerService } from './modules/customer/customer.service';
import { ServiceController } from './modules/service/service.controller';
import { ServiceService } from './modules/service/service.service';
import { AppointmentController } from './modules/appointment/appointment.controller';
import { AppointmentService } from './modules/appointment/appointment.service';
import { PosController } from './modules/pos/pos.controller';
import { PosService } from './modules/pos/pos.service';
import { InventoryController } from './modules/inventory/inventory.controller';
import { InventoryService } from './modules/inventory/inventory.service';
import { StaffController } from './modules/staff/staff.controller';
import { StaffService } from './modules/staff/staff.service';
import { CommissionController } from './modules/commission/commission.controller';
import { CommissionService } from './modules/commission/commission.service';
import { MembershipController } from './modules/membership/membership.controller';
import { MembershipService } from './modules/membership/membership.service';
import { MarketingModule } from './modules/marketing/marketing.module';
import { FinanceModule } from './modules/finance/finance.module';
import { EcommerceModule } from './modules/ecommerce/ecommerce.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [MarketingModule, FinanceModule, EcommerceModule, AiModule],
  controllers: [
    HealthController,
    SearchController,
    AuthController,
    HierarchyController,
    RbacController,
    CustomerController,
    ServiceController,
    AppointmentController,
    PosController,
    InventoryController,
    StaffController,
    CommissionController,
    MembershipController,
  ],
  providers: [
    AuditService,
    AuthService,
    HierarchyService,
    RbacService,
    CustomerService,
    ServiceService,
    AppointmentService,
    PosService,
    InventoryService,
    StaffService,
    CommissionService,
    MembershipService,
  ],
})
export class AppModule {}


