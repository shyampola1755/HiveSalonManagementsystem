import { Module } from '@nestjs/common';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commission.service';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [CommissionController],
  providers: [CommissionService, AuditService],
  exports: [CommissionService],
})
export class CommissionModule {}
