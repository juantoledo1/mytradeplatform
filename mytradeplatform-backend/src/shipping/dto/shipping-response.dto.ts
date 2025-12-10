import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShippingRateDto {
  @ApiProperty({ description: 'Shippo object ID', example: 'rate_abc123' })
  objectId: string;

  @ApiProperty({ description: 'Amount in USD', example: 12.5 })
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Carrier name', example: 'USPS' })
  provider: string;

  @ApiProperty({
    description: 'Service level name',
    example: 'Priority Mail',
  })
  servicelevel: string;

  @ApiProperty({
    description: 'Estimated delivery days',
    example: 3,
  })
  estimatedDays: number;

  @ApiPropertyOptional({
    description: 'Delivery date estimate',
    example: '2025-10-20',
  })
  durationTerms?: string;
}

export class ShippingLabelResponseDto {
  @ApiProperty({ description: 'Shippo transaction ID', example: 'trans_abc123' })
  transactionId: string;

  @ApiProperty({ description: 'Shippo object state', example: 'VALID' })
  objectState: string;

  @ApiProperty({
    description: 'Shipping label URL',
    example: 'https://shippo.com/label/abc123.pdf',
  })
  labelUrl: string;

  @ApiProperty({
    description: 'Tracking number',
    example: '9400111899562537842501',
  })
  trackingNumber: string;

  @ApiProperty({ description: 'Carrier', example: 'USPS' })
  carrier: string;

  @ApiProperty({ description: 'Service level', example: 'Priority Mail' })
  servicelevel: string;

  @ApiProperty({ description: 'Total cost in USD', example: 12.5 })
  cost: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiPropertyOptional({
    description: 'Commercial invoice URL',
    example: 'https://shippo.com/invoice/abc123.pdf',
  })
  commercialInvoiceUrl?: string;

  constructor(data: Partial<ShippingLabelResponseDto>) {
    Object.assign(this, data);
  }
}

export class TrackingEventDto {
  @ApiProperty({ description: 'Event status', example: 'TRANSIT' })
  status: string;

  @ApiProperty({ description: 'Event description', example: 'In transit' })
  statusDetails: string;

  @ApiProperty({
    description: 'Event location',
    example: 'SAN FRANCISCO, CA',
  })
  location: string;

  @ApiProperty({
    description: 'Event timestamp',
    example: '2025-10-14T10:30:00Z',
  })
  datetime: string;
}

export class TrackingInfoResponseDto {
  @ApiProperty({ description: 'Carrier', example: 'USPS' })
  carrier: string;

  @ApiProperty({
    description: 'Tracking number',
    example: '9400111899562537842501',
  })
  trackingNumber: string;

  @ApiProperty({
    description: 'Tracking status',
    example: 'TRANSIT',
    enum: [
      'UNKNOWN',
      'PRE_TRANSIT',
      'TRANSIT',
      'DELIVERED',
      'RETURNED',
      'FAILURE',
    ],
  })
  trackingStatus: string;

  @ApiProperty({
    description: 'Tracking history',
    type: [TrackingEventDto],
  })
  trackingHistory: TrackingEventDto[];

  @ApiPropertyOptional({
    description: 'Estimated delivery date',
    example: '2025-10-20',
  })
  eta?: string;

  constructor(data: Partial<TrackingInfoResponseDto>) {
    Object.assign(this, data);
  }
}

export class RatesResponseDto {
  @ApiProperty({
    description: 'Available shipping rates',
    type: [ShippingRateDto],
  })
  rates: ShippingRateDto[];

  @ApiProperty({ description: 'Shipment object ID', example: 'ship_abc123' })
  shipmentId: string;

  constructor(data: Partial<RatesResponseDto>) {
    Object.assign(this, data);
  }
}
