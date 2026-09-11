import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationProvider,
  SendMessageOptions,
} from './notification-provider.interface';
import { WhatsAppCloudProvider } from './whatsapp.provider';
import { SmsMsg91Provider } from './sms.provider';
import { EmailResendProvider } from './email.provider';
import {
  CommunicationChannel,
  ProviderDeliveryResult,
  CommunicationPreferenceDto,
} from '@hive/types';

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);
  private providers = new Map<CommunicationChannel, NotificationProvider>();

  constructor(
    private readonly whatsappProvider: WhatsAppCloudProvider,
    private readonly smsProvider: SmsMsg91Provider,
    private readonly emailProvider: EmailResendProvider
  ) {
    this.registerProvider(this.whatsappProvider);
    this.registerProvider(this.smsProvider);
    this.registerProvider(this.emailProvider);
  }

  registerProvider(provider: NotificationProvider) {
    this.providers.set(provider.getChannel(), provider);
    this.logger.log(`Registered Notification Provider: [${provider.getChannel()}] -> ${provider.getProviderName()}`);
  }

  getProvider(channel: CommunicationChannel): NotificationProvider | undefined {
    return this.providers.get(channel);
  }

  async dispatchMessage(
    channel: CommunicationChannel,
    options: SendMessageOptions,
    consentPreference?: CommunicationPreferenceDto,
    isMarketingMessage: boolean = false
  ): Promise<ProviderDeliveryResult> {
    // 1. Consent Verification Check
    if (consentPreference && isMarketingMessage) {
      if (channel === 'WHATSAPP' && !consentPreference.allowMarketingWhatsapp) {
        return {
          success: false,
          providerName: 'CONSENT_GUARD',
          status: 'OPTED_OUT',
          error: 'Customer has opted out of marketing communications via WhatsApp',
        };
      }
      if (channel === 'SMS' && !consentPreference.allowMarketingSms) {
        return {
          success: false,
          providerName: 'CONSENT_GUARD',
          status: 'OPTED_OUT',
          error: 'Customer has opted out of marketing communications via SMS',
        };
      }
      if (channel === 'EMAIL' && !consentPreference.allowMarketingEmail) {
        return {
          success: false,
          providerName: 'CONSENT_GUARD',
          status: 'OPTED_OUT',
          error: 'Customer has opted out of marketing communications via Email',
        };
      }
    }

    // 2. Select Provider
    const provider = this.getProvider(channel);
    if (!provider) {
      return {
        success: false,
        providerName: 'NONE',
        status: 'FAILED',
        error: `No provider registered for channel ${channel}`,
      };
    }

    // 3. Execute Send
    try {
      return await provider.send(options);
    } catch (err: any) {
      this.logger.error(`Error sending message via ${provider.getProviderName()}: ${err?.message || err}`);
      return {
        success: false,
        providerName: provider.getProviderName(),
        status: 'FAILED',
        error: err?.message || 'Unknown provider error',
      };
    }
  }
}
