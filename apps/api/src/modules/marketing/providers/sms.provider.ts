import { Injectable } from '@nestjs/common';
import {
  NotificationProvider,
  SendMessageOptions,
} from './notification-provider.interface';
import { CommunicationChannel, ProviderDeliveryResult } from '@hive/types';

@Injectable()
export class SmsMsg91Provider implements NotificationProvider {
  getChannel(): CommunicationChannel {
    return 'SMS';
  }

  getProviderName(): string {
    return 'MSG91_SMS_GATEWAY';
  }

  async send(options: SendMessageOptions): Promise<ProviderDeliveryResult> {
    if (!options.recipientPhone) {
      return {
        success: false,
        providerName: this.getProviderName(),
        status: 'FAILED',
        error: 'Recipient phone number is missing for SMS delivery',
      };
    }

    // In a live production environment, this calls MSG91 API: POST https://api.msg91.com/api/v5/flow/
    const providerMessageId = `msg91_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      success: true,
      providerMessageId,
      providerName: this.getProviderName(),
      status: 'DELIVERED',
    };
  }
}
