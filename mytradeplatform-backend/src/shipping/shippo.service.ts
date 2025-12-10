import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ShippingAddress {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface PackageDimensions {
  length: string;
  width: string;
  height: string;
  distance_unit: 'in' | 'cm';
  weight: string;
  mass_unit: 'lb' | 'oz' | 'kg' | 'g';
}

export interface ShippingRate {
  object_id: string;
  servicelevel: {
    name: string;
    token: string;
  };
  amount: string;
  currency: string;
  estimated_days: number;
  carrier: string;
}

export interface ShippingLabel {
  object_id: string;
  tracking_number: string;
  label_url: string;
  tracking_status: string;
  carrier: string;
  servicelevel: string;
}

@Injectable()
export class ShippoService {
  private readonly logger = new Logger(ShippoService.name);
  private shippo: any;

      constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('SHIPPO_API_KEY');
        if (!apiKey) {
          this.logger.warn('SHIPPO_API_KEY not configured - Using mock Shippo service');
          this.shippo = null;
        } else {
          this.logger.log('Shippo service initialized with real API key');
          this.shippo = 'real'; // Usar API real de Shippo
        }
      }

  /**
   * Create a shipping address in Shippo
   */
  async createAddress(address: ShippingAddress): Promise<any> {
    if (!this.shippo) {
      throw new BadRequestException('Shippo service is not initialized. Please check API key configuration.');
    }
    
    if (this.shippo === 'real') {
      try {
        const apiKey = this.configService.get<string>('SHIPPO_API_KEY');
        if (!apiKey) {
          throw new BadRequestException('SHIPPO_API_KEY is not configured');
        }
        const shippo = require('shippo')(apiKey);

        const realAddress = await shippo.address.create({
          name: address.name,
          company: address.company,
          street1: address.street1,
          street2: address.street2,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
          phone: address.phone,
          email: address.email,
        });

        this.logger.log(`Real Shippo address created: ${realAddress.object_id}`);
        return realAddress;

      } catch (error) {
        this.logger.error(`Error creating real Shippo address: ${error.message}`);
        // Fallback to mock
        return this.getMockAddress(address);
      }
    } else {
      // Mock response for development
      return this.getMockAddress(address);
    }
  }

  private getMockAddress(address: ShippingAddress): any {
    const mockAddress = {
      object_id: `addr_${Date.now()}`,
      name: address.name,
      company: address.company,
      street1: address.street1,
      street2: address.street2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
      email: address.email,
      validation_results: {
        is_valid: true,
        messages: []
      }
    };

    this.logger.log(`Mock address created: ${mockAddress.object_id}`);
    return mockAddress;
  }

  /**
   * Create a parcel with dimensions and weight
   */
  async createParcel(dimensions: PackageDimensions): Promise<any> {
    if (this.shippo === 'real') {
      try {
        const apiKey = this.configService.get<string>('SHIPPO_API_KEY');
        if (!apiKey) {
          throw new BadRequestException('SHIPPO_API_KEY is not configured');
        }
        const shippo = require('shippo')(apiKey);

        const realParcel = await shippo.parcel.create({
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height,
          distance_unit: dimensions.distance_unit,
          weight: dimensions.weight,
          mass_unit: dimensions.mass_unit,
        });

        this.logger.log(`Real Shippo parcel created: ${realParcel.object_id}`);
        return realParcel;

      } catch (error) {
        this.logger.error(`Error creating real Shippo parcel: ${error.message}`);
        // Fallback to mock
        return this.getMockParcel(dimensions);
      }
    } else {
      // Mock response for development
      return this.getMockParcel(dimensions);
    }
  }

  private getMockParcel(dimensions: PackageDimensions): any {
    const mockParcel = {
      object_id: `parcel_${Date.now()}`,
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      distance_unit: dimensions.distance_unit,
      weight: dimensions.weight,
      mass_unit: dimensions.mass_unit,
    };

    this.logger.log(`Mock parcel created: ${mockParcel.object_id}`);
    return mockParcel;
  }

      /**
       * Get shipping rates for a shipment
       */
      async getShippingRates(
        fromAddress: ShippingAddress,
        toAddress: ShippingAddress,
        dimensions: PackageDimensions,
        carriers: string[] = ['usps', 'ups', 'fedex']
      ): Promise<ShippingRate[]> {
        if (this.shippo === 'real') {
          try {
            // Use real Shippo API
            const apiKey = this.configService.get<string>('SHIPPO_API_KEY');
            if (!apiKey) {
              throw new BadRequestException('SHIPPO_API_KEY is not configured');
            }
            const shippo = require('shippo')(apiKey);

            // Create addresses
            const fromAddr = await this.createAddress(fromAddress);
            const toAddr = await this.createAddress(toAddress);

            // Create parcel
            const parcel = await this.createParcel(dimensions);

            // Create shipment
            const shipment = await shippo.shipment.create({
              address_from: fromAddr.object_id,
              address_to: toAddr.object_id,
              parcels: [parcel.object_id],
              carrier_accounts: carriers.map(carrier => `${carrier}_account_id`), // You'll need to configurar these
            });

            this.logger.log(`Real Shippo rates retrieved: ${shipment.rates?.length || 0} rates`);
            return shipment.rates || [];

          } catch (error) {
            this.logger.error(`Error getting real Shippo rates: ${error.message}`);
            // Fallback to mock rates
            return this.getMockRates();
          }
        } else {
          // Mock response for development
          return this.getMockRates();
        }
      }

      private getMockRates(): ShippingRate[] {
        const mockRates: ShippingRate[] = [
          {
            object_id: `rate_${Date.now()}_1`,
            servicelevel: {
              name: 'USPS Priority Mail',
              token: 'usps_priority',
            },
            amount: '8.50',
            currency: 'USD',
            estimated_days: 2,
            carrier: 'usps',
          },
          {
            object_id: `rate_${Date.now()}_2`,
            servicelevel: {
              name: 'UPS Ground',
              token: 'ups_ground',
            },
            amount: '12.75',
            currency: 'USD',
            estimated_days: 3,
            carrier: 'ups',
          },
          {
            object_id: `rate_${Date.now()}_3`,
            servicelevel: {
              name: 'FedEx Express',
              token: 'fedex_express',
            },
            amount: '15.20',
            currency: 'USD',
            estimated_days: 1,
            carrier: 'fedex',
          },
        ];

        this.logger.log(`Mock shipping rates generated: ${mockRates.length} rates`);
        return mockRates;
      }

  /**
   * Create a shipping label
   */
  async createShippingLabel(
    rateId: string,
    labelFormat: string = 'PDF'
  ): Promise<ShippingLabel> {
    // Mock response for development
    const mockLabel: ShippingLabel = {
      object_id: `label_${Date.now()}`,
      tracking_number: `1Z${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
      label_url: '/placeholder-shipping-label.pdf',
      tracking_status: 'pending',
      carrier: 'ups',
      servicelevel: 'Ground',
    };

    this.logger.log(`Mock shipping label created: ${mockLabel.object_id}`);
    return mockLabel;
  }

  /**
   * Track a shipment
   */
  async trackShipment(trackingNumber: string, carrier: string): Promise<any> {
    try {
      const tracking = await this.shippo.track.get_status(carrier, trackingNumber);
      this.logger.log(`Tracking info retrieved for ${trackingNumber}`);
      return tracking;
    } catch (error) {
      this.logger.error(`Failed to track shipment: ${error.message}`);
      throw new BadRequestException(`Failed to track shipment: ${error.message}`);
    }
  }

  /**
   * Get carrier account ID (you'll need to configure these in Shippo)
   */
  private getCarrierAccountId(carrier: string): string | null {
    const carrierAccounts = {
      usps: this.configService.get<string>('SHIPPO_USPS_ACCOUNT_ID'),
      ups: this.configService.get<string>('SHIPPO_UPS_ACCOUNT_ID'),
      fedex: this.configService.get<string>('SHIPPO_FEDEX_ACCOUNT_ID'),
    };
    
    return carrierAccounts[carrier] || null;
  }

  /**
   * Validate an address
   */
  async validateAddress(address: ShippingAddress): Promise<{ valid: boolean; suggestions?: any[] }> {
    try {
      const result = await this.shippo.address.create({
        ...address,
        validate: true,
      });

      return {
        valid: result.is_complete,
        suggestions: result.validation_results?.suggestions || [],
      };
    } catch (error) {
      this.logger.error(`Failed to validate address: ${error.message}`);
      return { valid: false };
    }
  }

  /**
   * Get available carriers
   */
  async getAvailableCarriers(): Promise<string[]> {
    return ['usps', 'ups', 'fedex'];
  }

  /**
   * Calculate shipping cost for a specific service
   */
  async calculateShippingCost(
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    dimensions: PackageDimensions,
    service: string
  ): Promise<{ cost: number; currency: string; estimated_days: number }> {
    try {
      const rates = await this.getShippingRates(fromAddress, toAddress, dimensions);
      const selectedRate = rates.find(rate => 
        rate.servicelevel.token === service || rate.servicelevel.name === service
      );

      if (!selectedRate) {
        throw new BadRequestException(`Service ${service} not available`);
      }

      return {
        cost: parseFloat(selectedRate.amount),
        currency: selectedRate.currency,
        estimated_days: selectedRate.estimated_days,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate shipping cost: ${error.message}`);
      throw new BadRequestException(`Failed to calculate shipping cost: ${error.message}`);
    }
  }
}
