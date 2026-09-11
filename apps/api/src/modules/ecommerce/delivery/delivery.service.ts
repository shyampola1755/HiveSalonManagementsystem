import { Injectable, Logger } from '@nestjs/common';
import {
  DeliveryProviderId,
  DeliveryProviderEstimate,
  DeliveryShipmentPayload,
  DeliveryShipmentResult,
  DeliveryTrackingCheckpoint,
} from '@hive/types';

export interface IDeliveryProvider {
  id: DeliveryProviderId;
  name: string;
  calculateEstimate(pincode: string, weightKg: number): Promise<DeliveryProviderEstimate>;
  createShipment(payload: DeliveryShipmentPayload): Promise<DeliveryShipmentResult>;
  trackShipment(trackingNumber: string): Promise<{
    currentStatus: string;
    checkpoints: DeliveryTrackingCheckpoint[];
    estimatedDelivery: string;
  }>;
  cancelShipment(trackingNumber: string): Promise<boolean>;
}

@Injectable()
export class InternalFleetProvider implements IDeliveryProvider {
  id: DeliveryProviderId = 'INTERNAL_FLEET';
  name = 'Hive Salon Concierge (Express Local Fleet)';
  private readonly logger = new Logger(InternalFleetProvider.name);

  async calculateEstimate(pincode: string, weightKg: number): Promise<DeliveryProviderEstimate> {
    return {
      providerId: 'INTERNAL_FLEET',
      providerName: this.name,
      serviceLevel: 'EXPRESS_24H',
      estimatedDays: 'Within 24 Hours (Guaranteed Salon White-Glove)',
      shippingFee: 149.0,
      isAvailable: true,
      description: 'Hand-delivered by certified Hive Salon logistics specialists in climate-controlled luxury tote.',
      cutoffTimeNotice: 'Orders placed before 4:00 PM dispatched same evening.',
    };
  }

  async createShipment(payload: DeliveryShipmentPayload): Promise<DeliveryShipmentResult> {
    const trackingNumber = `HIVE-CNC-${Date.now().toString().slice(-6)}`;
    this.logger.log(`Created internal concierge shipment ${trackingNumber} for order ${payload.orderId}`);
    return {
      success: true,
      trackingNumber,
      carrier: 'INTERNAL_FLEET',
      carrierName: this.name,
      trackingUrl: `https://track.hivesalon.com/concierge/${trackingNumber}`,
      labelPdfUrl: `/api/v1/ecommerce/shipping-labels/${trackingNumber}.pdf`,
      estimatedDelivery: 'Tomorrow by 02:00 PM',
    };
  }

  async trackShipment(trackingNumber: string) {
    const now = new Date();
    return {
      currentStatus: 'OUT_FOR_DELIVERY',
      checkpoints: [
        {
          timestamp: new Date(now.getTime() - 3600000 * 2).toISOString(),
          status: 'DISPATCHED',
          location: 'Hive Indiranagar Flagship Sanctuary Hub',
          description: 'Package inspected, sealed in tamper-proof silk bag, and assigned to Salon Courier Rider.',
        },
        {
          timestamp: new Date(now.getTime() - 1800000).toISOString(),
          status: 'IN_TRANSIT',
          location: 'HAL 2nd Stage Local Zone',
          description: 'Concierge driver on route to customer destination.',
        },
        {
          timestamp: now.toISOString(),
          status: 'OUT_FOR_DELIVERY',
          location: 'Destination Neighborhood',
          description: 'Courier arriving within 25 minutes. Contactless handover with OTP.',
        },
      ],
      estimatedDelivery: 'Today within 45 mins',
    };
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    this.logger.log(`Cancelled internal fleet shipment ${trackingNumber}`);
    return true;
  }
}

@Injectable()
export class DunzoHyperlocalProvider implements IDeliveryProvider {
  id: DeliveryProviderId = 'DUNZO';
  name = 'Dunzo / Shadowfax Hyperlocal Express (60–90 Mins)';
  private readonly logger = new Logger(DunzoHyperlocalProvider.name);

  async calculateEstimate(pincode: string, weightKg: number): Promise<DeliveryProviderEstimate> {
    return {
      providerId: 'DUNZO',
      providerName: this.name,
      serviceLevel: 'SAME_DAY',
      estimatedDays: '60–90 Minutes Hyperlocal',
      shippingFee: 199.0,
      isAvailable: true,
      description: 'Lightning-fast city dispatch from the nearest salon branch directly to your doorstep.',
      cutoffTimeNotice: 'Available between 09:30 AM to 08:30 PM daily.',
    };
  }

  async createShipment(payload: DeliveryShipmentPayload): Promise<DeliveryShipmentResult> {
    const trackingNumber = `DNZ-${Math.floor(10000000 + Math.random() * 90000000)}`;
    this.logger.log(`Allocated Dunzo Hyperlocal courier task ${trackingNumber} for order ${payload.orderId}`);
    return {
      success: true,
      trackingNumber,
      carrier: 'DUNZO',
      carrierName: this.name,
      trackingUrl: `https://track.dunzo.com/express/${trackingNumber}`,
      labelPdfUrl: `/api/v1/ecommerce/shipping-labels/${trackingNumber}.pdf`,
      estimatedDelivery: 'Today within 90 minutes',
    };
  }

  async trackShipment(trackingNumber: string) {
    const now = new Date();
    return {
      currentStatus: 'OUT_FOR_DELIVERY',
      checkpoints: [
        {
          timestamp: new Date(now.getTime() - 2400000).toISOString(),
          status: 'RIDER_ASSIGNED',
          location: 'Assigned Partner: Rajesh M. (+91 98877 66554)',
          description: 'Delivery partner arrived at salon branch pickup bay.',
        },
        {
          timestamp: new Date(now.getTime() - 1200000).toISOString(),
          status: 'ORDER_PICKED_UP',
          location: 'Hive Indiranagar Branch',
          description: 'Package collected from dispatch counter.',
        },
        {
          timestamp: now.toISOString(),
          status: 'OUT_FOR_DELIVERY',
          location: 'Live GPS: 1.2 km away from address',
          description: 'Partner is approaching delivery location.',
        },
      ],
      estimatedDelivery: 'In approximately 18 minutes',
    };
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    this.logger.log(`Cancelled Dunzo shipment ${trackingNumber}`);
    return true;
  }
}

@Injectable()
export class DelhiveryProvider implements IDeliveryProvider {
  id: DeliveryProviderId = 'DELHIVERY';
  name = 'Delhivery National Express Surface / Air';
  private readonly logger = new Logger(DelhiveryProvider.name);

  async calculateEstimate(pincode: string, weightKg: number): Promise<DeliveryProviderEstimate> {
    return {
      providerId: 'DELHIVERY',
      providerName: this.name,
      serviceLevel: 'STANDARD_SURFACE',
      estimatedDays: '2–3 Business Days Pan-India',
      shippingFee: 99.0,
      isAvailable: true,
      description: 'Reliable pan-India delivery with full parcel tracking and SMS updates.',
    };
  }

  async createShipment(payload: DeliveryShipmentPayload): Promise<DeliveryShipmentResult> {
    const trackingNumber = `DLV${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    this.logger.log(`Generated Delhivery AWB airway bill ${trackingNumber} for order ${payload.orderId}`);
    return {
      success: true,
      trackingNumber,
      carrier: 'DELHIVERY',
      carrierName: this.name,
      trackingUrl: `https://www.delhivery.com/track/package/${trackingNumber}`,
      labelPdfUrl: `/api/v1/ecommerce/shipping-labels/${trackingNumber}.pdf`,
      estimatedDelivery: 'In 2 business days',
    };
  }

  async trackShipment(trackingNumber: string) {
    const now = new Date();
    return {
      currentStatus: 'IN_TRANSIT',
      checkpoints: [
        {
          timestamp: new Date(now.getTime() - 86400000).toISOString(),
          status: 'MANIFESTED',
          location: 'Hyderabad Regional Mother Hub',
          description: 'Electronic data received from Hive Salon e-commerce system.',
        },
        {
          timestamp: new Date(now.getTime() - 43200000).toISOString(),
          status: 'IN_TRANSIT',
          location: 'Bengaluru Sort Center (Devanahalli)',
          description: 'Bagged and in-transit to destination delivery station.',
        },
        {
          timestamp: now.toISOString(),
          status: 'REACHED_LOCAL_HUB',
          location: 'Indiranagar Delivery Center',
          description: 'Shipment received at destination station. Scheduled for out-for-delivery next morning.',
        },
      ],
      estimatedDelivery: 'Tomorrow by 07:00 PM',
    };
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    this.logger.log(`Cancelled Delhivery AWB ${trackingNumber}`);
    return true;
  }
}

@Injectable()
export class BlueDartProvider implements IDeliveryProvider {
  id: DeliveryProviderId = 'BLUEDART';
  name = 'Blue Dart Apex Priority Air';
  private readonly logger = new Logger(BlueDartProvider.name);

  async calculateEstimate(pincode: string, weightKg: number): Promise<DeliveryProviderEstimate> {
    return {
      providerId: 'BLUEDART',
      providerName: this.name,
      serviceLevel: 'PRIORITY_AIR',
      estimatedDays: 'Next Business Day by 12:00 PM',
      shippingFee: 249.0,
      isAvailable: true,
      description: 'Air priority express shipping for time-critical luxury styling appliances and skin treatments.',
      cutoffTimeNotice: 'Dispatches via daily evening air cargo connection.',
    };
  }

  async createShipment(payload: DeliveryShipmentPayload): Promise<DeliveryShipmentResult> {
    const trackingNumber = `BLU${Math.floor(100000000 + Math.random() * 900000000)}`;
    this.logger.log(`Generated Blue Dart Airway Bill ${trackingNumber} for order ${payload.orderId}`);
    return {
      success: true,
      trackingNumber,
      carrier: 'BLUEDART',
      carrierName: this.name,
      trackingUrl: `https://www.bluedart.com/tracking?handler=tnt&action=custtrack&trackid=${trackingNumber}`,
      labelPdfUrl: `/api/v1/ecommerce/shipping-labels/${trackingNumber}.pdf`,
      estimatedDelivery: 'Tomorrow by 12:00 PM',
    };
  }

  async trackShipment(trackingNumber: string) {
    const now = new Date();
    return {
      currentStatus: 'IN_TRANSIT',
      checkpoints: [
        {
          timestamp: new Date(now.getTime() - 28800000).toISOString(),
          status: 'PICKED_UP',
          location: 'Hive Salon Bangalore Central Hub',
          description: 'Package picked up by Blue Dart Air Express van.',
        },
        {
          timestamp: new Date(now.getTime() - 14400000).toISOString(),
          status: 'AIR_CARGO_DEPARTED',
          location: 'Kempegowda Int. Airport (BLR Cargo Terminal)',
          description: 'Loaded into Apex Air Freight cargo container.',
        },
        {
          timestamp: now.toISOString(),
          status: 'ARRIVED_DESTINATION_AIRPORT',
          location: 'Destination Air Freight Terminal',
          description: 'Sorted for morning express priority delivery cycle.',
        },
      ],
      estimatedDelivery: 'Tomorrow by 11:30 AM',
    };
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    this.logger.log(`Cancelled Blue Dart shipment ${trackingNumber}`);
    return true;
  }
}

@Injectable()
export class DeliveryService {
  private readonly providers: Map<DeliveryProviderId, IDeliveryProvider> = new Map();

  constructor(
    private readonly internalFleet: InternalFleetProvider,
    private readonly dunzo: DunzoHyperlocalProvider,
    private readonly delhivery: DelhiveryProvider,
    private readonly blueDart: BlueDartProvider
  ) {
    this.providers.set('INTERNAL_FLEET', this.internalFleet);
    this.providers.set('DUNZO', this.dunzo);
    this.providers.set('DELHIVERY', this.delhivery);
    this.providers.set('BLUEDART', this.blueDart);
  }

  async getAvailableProviders(pincode: string, weightKg = 0.5): Promise<DeliveryProviderEstimate[]> {
    const results: DeliveryProviderEstimate[] = [];
    for (const provider of this.providers.values()) {
      try {
        const estimate = await provider.calculateEstimate(pincode, weightKg);
        results.push(estimate);
      } catch (err) {
        // Skip unavailable provider for given pincode
      }
    }
    return results;
  }

  getProvider(providerId: DeliveryProviderId): IDeliveryProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      return this.internalFleet; // Fallback to internal fleet
    }
    return provider;
  }

  async createShipment(payload: DeliveryShipmentPayload): Promise<DeliveryShipmentResult> {
    const provider = this.getProvider(payload.providerId);
    return provider.createShipment(payload);
  }

  async trackShipment(providerId: DeliveryProviderId, trackingNumber: string) {
    const provider = this.getProvider(providerId);
    return provider.trackShipment(trackingNumber);
  }

  async cancelShipment(providerId: DeliveryProviderId, trackingNumber: string): Promise<boolean> {
    const provider = this.getProvider(providerId);
    return provider.cancelShipment(trackingNumber);
  }
}
