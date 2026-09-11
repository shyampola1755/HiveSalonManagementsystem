import { Module } from '@nestjs/common';
import { EcommerceController } from './ecommerce.controller';
import { EcommerceService } from './ecommerce.service';
import {
  DeliveryService,
  InternalFleetProvider,
  DunzoHyperlocalProvider,
  DelhiveryProvider,
  BlueDartProvider,
} from './delivery/delivery.service';

@Module({
  controllers: [EcommerceController],
  providers: [
    EcommerceService,
    DeliveryService,
    InternalFleetProvider,
    DunzoHyperlocalProvider,
    DelhiveryProvider,
    BlueDartProvider,
  ],
  exports: [EcommerceService, DeliveryService],
})
export class EcommerceModule {}
