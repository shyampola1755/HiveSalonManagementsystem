import { Module } from '@nestjs/common';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';
import { NotificationDispatcherService } from './providers/notification-dispatcher.service';
import { WhatsAppCloudProvider } from './providers/whatsapp.provider';
import { SmsMsg91Provider } from './providers/sms.provider';
import { EmailResendProvider } from './providers/email.provider';

@Module({
  controllers: [MarketingController],
  providers: [
    MarketingService,
    NotificationDispatcherService,
    WhatsAppCloudProvider,
    SmsMsg91Provider,
    EmailResendProvider,
  ],
  exports: [
    MarketingService,
    NotificationDispatcherService,
    WhatsAppCloudProvider,
    SmsMsg91Provider,
    EmailResendProvider,
  ],
})
export class MarketingModule {}
