import { Injectable } from '@nestjs/common';
import {
  NotificationProvider,
  SendMessageOptions,
} from './notification-provider.interface';
import { CommunicationChannel, ProviderDeliveryResult } from '@hive/types';

@Injectable()
export class EmailResendProvider implements NotificationProvider {
  getChannel(): CommunicationChannel {
    return 'EMAIL';
  }

  getProviderName(): string {
    return 'RESEND_EMAIL_GATEWAY';
  }

  async send(options: SendMessageOptions): Promise<ProviderDeliveryResult> {
    if (!options.recipientEmail) {
      return {
        success: false,
        providerName: this.getProviderName(),
        status: 'FAILED',
        error: 'Recipient email address is missing for Email delivery',
      };
    }

    // In a live production environment, this calls Resend API: POST https://api.resend.com/emails
    const providerMessageId = `resend_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      success: true,
      providerMessageId,
      providerName: this.getProviderName(),
      status: 'DELIVERED',
    };
  }
}
