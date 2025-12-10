import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateShippingLabelDto } from './dto/create-label.dto';
import {
  ShippingLabelResponseDto,
  TrackingInfoResponseDto,
  RatesResponseDto,
  TrackingEventDto,
} from './dto/shipping-response.dto';
import axios, { AxiosInstance } from 'axios';

interface ShippoAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

interface ShippoParcel {
  length: number;
  width: number;
  height: number;
  distance_unit: string;
  weight: number;
  mass_unit: string;
}

interface ShippoRate {
  object_id: string;
  amount: string;
  currency: string;
  provider: string;
  servicelevel: {
    name: string;
    token: string;
  };
  estimated_days: number;
  duration_terms: string;
}

interface ShippoTransaction {
  object_id: string;
  object_state: string;
  label_url: string;
  tracking_number: string;
  rate: {
    provider: string;
    servicelevel: {
      name: string;
    };
    amount: string;
    currency: string;
  };
  commercial_invoice_url?: string;
}

interface ShippoTracking {
  carrier: string;
  tracking_number: string;
  tracking_status: {
    status: string;
  };
  tracking_history: Array<{
    status: string;
    status_details: string;
    location: {
      city?: string;
      state?: string;
    };
    object_created: string;
  }>;
  eta?: string;
}

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  private shippoClient: AxiosInstance;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const shippoApiKey = this.configService.get<string>('SHIPPO_API_KEY');
    if (!shippoApiKey) {
      this.logger.warn(
        'SHIPPO_API_KEY not configured - shipping will fail',
      );
    }

    this.shippoClient = axios.create({
      baseURL: 'https://api.goshippo.com',
      headers: {
        Authorization: `ShippoToken ${shippoApiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get shipping rates for a parcel
   */
  async getRates(
    createLabelDto: CreateShippingLabelDto,
  ): Promise<RatesResponseDto> {
    const { addressFrom, addressTo, parcel } = createLabelDto;

    try {
      // Create shipment to get rates
      const shipmentResponse = await this.shippoClient.post('/shipments', {
        address_from: this.mapToShippoAddress(addressFrom),
        address_to: this.mapToShippoAddress(addressTo),
        parcels: [this.mapToShippoParcel(parcel)],
        async: false,
      });

      const rates = shipmentResponse.data.rates.map((rate: ShippoRate) => ({
        objectId: rate.object_id,
        amount: parseFloat(rate.amount),
        currency: rate.currency,
        provider: rate.provider,
        servicelevel: rate.servicelevel.name,
        estimatedDays: rate.estimated_days,
        durationTerms: rate.duration_terms,
      }));

      return new RatesResponseDto({
        rates,
        shipmentId: shipmentResponse.data.object_id,
      });
    } catch (error) {
      this.logger.error(
        `Failed to get shipping rates: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException(
        'Failed to retrieve shipping rates',
      );
    }
  }

  /**
   * Create shipping label
   */
  async createLabel(
    userId: number,
    createLabelDto: CreateShippingLabelDto,
  ): Promise<ShippingLabelResponseDto> {
    const {
      tradeId,
      addressFrom,
      addressTo,
      parcel,
      includeInsurance,
      insuranceAmount,
      serviceLevelToken,
    } = createLabelDto;

    // Verify trade exists and user is authorized
    const trade = await this.prisma.trade.findFirst({
      where: {
        id: tradeId,
        OR: [{ traderOfferingId: userId }, { traderReceivingId: userId }],
      },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found or unauthorized');
    }

    try {
      // First create shipment
      const shipmentResponse = await this.shippoClient.post('/shipments', {
        address_from: this.mapToShippoAddress(addressFrom),
        address_to: this.mapToShippoAddress(addressTo),
        parcels: [this.mapToShippoParcel(parcel)],
        async: false,
      });

      // Find the rate to use
      const rates: ShippoRate[] = shipmentResponse.data.rates;
      let selectedRate: ShippoRate | undefined;

      if (serviceLevelToken) {
        selectedRate = rates.find(
          (r) => r.servicelevel.token === serviceLevelToken,
        );
      } else {
        // Select cheapest rate by default
        selectedRate = rates.reduce((prev, curr) =>
          parseFloat(prev.amount) < parseFloat(curr.amount) ? prev : curr,
        );
      }

      if (!selectedRate) {
        throw new BadRequestException('No valid shipping rate found');
      }

      // Create transaction (purchase label)
      const transactionData: Record<string, unknown> = {
        rate: selectedRate.object_id,
        async: false,
      };

      // Add insurance if requested
      if (includeInsurance && insuranceAmount) {
        transactionData.extra = {
          insurance: {
            amount: insuranceAmount.toString(),
            currency: 'USD',
          },
        };
      }

      const transactionResponse = await this.shippoClient.post(
        '/transactions',
        transactionData,
      );

      const transaction: ShippoTransaction = transactionResponse.data;

      this.logger.log(
        `Shipping label created: Trade ${tradeId}, Transaction ${transaction.object_id}`,
      );

      return new ShippingLabelResponseDto({
        transactionId: transaction.object_id,
        objectState: transaction.object_state,
        labelUrl: transaction.label_url,
        trackingNumber: transaction.tracking_number,
        carrier: transaction.rate.provider,
        servicelevel: transaction.rate.servicelevel.name,
        cost: parseFloat(transaction.rate.amount),
        currency: transaction.rate.currency,
        commercialInvoiceUrl: transaction.commercial_invoice_url,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create shipping label: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (axios.isAxiosError(error)) {
        throw new BadRequestException(
          `Shippo API error: ${error.response?.data?.detail || error.message}`,
        );
      }

      throw new BadRequestException('Failed to create shipping label');
    }
  }

  /**
   * Get tracking information
   */
  async getTracking(
    carrier: string,
    trackingNumber: string,
  ): Promise<TrackingInfoResponseDto> {
    try {
      const response = await this.shippoClient.get(
        `/tracks/${carrier}/${trackingNumber}`,
      );

      const tracking: ShippoTracking = response.data;

      const trackingHistory: TrackingEventDto[] = tracking.tracking_history.map(
        (event) => ({
          status: event.status,
          statusDetails: event.status_details,
          location: `${event.location.city || ''}, ${event.location.state || ''}`.trim(),
          datetime: event.object_created,
        }),
      );

      return new TrackingInfoResponseDto({
        carrier: tracking.carrier,
        trackingNumber: tracking.tracking_number,
        trackingStatus: tracking.tracking_status.status,
        trackingHistory,
        eta: tracking.eta,
      });
    } catch (error) {
      this.logger.error(
        `Failed to get tracking info: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new NotFoundException('Tracking information not found');
        }
        throw new BadRequestException(
          `Shippo API error: ${error.response?.data?.detail || error.message}`,
        );
      }

      throw new BadRequestException('Failed to retrieve tracking information');
    }
  }

  private mapToShippoAddress(address: CreateShippingLabelDto['addressFrom']): ShippoAddress {
    return {
      name: address.name,
      street1: address.street1,
      street2: address.street2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
      email: address.email,
    };
  }

  private mapToShippoParcel(parcel: CreateShippingLabelDto['parcel']): ShippoParcel {
    return {
      length: parcel.length,
      width: parcel.width,
      height: parcel.height,
      distance_unit: parcel.distance_unit,
      weight: parcel.weight,
      mass_unit: parcel.mass_unit,
    };
  }
}
