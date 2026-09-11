import { CommunicationChannel, ProviderDeliveryResult } from '@hive/types';

export interface SendMessageOptions {
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  content: string;
  messageType: string;
  metadata?: Record<string, any>;
}

export interface NotificationProvider {
  getChannel(): CommunicationChannel;
  getProviderName(): string;
  send(options: SendMessageOptions): Promise<ProviderDeliveryResult>;
}
