import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

class AddressDto {
  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Street address line 1', example: '123 Main St' })
  @IsString()
  street1: string;

  @ApiPropertyOptional({
    description: 'Street address line 2',
    example: 'Apt 4B',
  })
  @IsOptional()
  @IsString()
  street2?: string;

  @ApiProperty({ description: 'City', example: 'San Francisco' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'CA' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'ZIP/Postal code', example: '94103' })
  @IsString()
  zip: string;

  @ApiProperty({ description: 'Country code', example: 'US' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'john@example.com' })
  @IsOptional()
  @IsString()
  email?: string;
}

class ParcelDto {
  @ApiProperty({
    description: 'Length in inches',
    example: 10,
    minimum: 0.01,
    maximum: 999,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999)
  length: number;

  @ApiProperty({
    description: 'Width in inches',
    example: 8,
    minimum: 0.01,
    maximum: 999,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999)
  width: number;

  @ApiProperty({
    description: 'Height in inches',
    example: 6,
    minimum: 0.01,
    maximum: 999,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999)
  height: number;

  @ApiProperty({
    description: 'Weight in pounds',
    example: 5,
    minimum: 0.01,
    maximum: 999,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999)
  weight: number;

  @ApiProperty({
    description: 'Distance unit',
    example: 'in',
    enum: ['in', 'cm', 'ft', 'm'],
  })
  @IsEnum(['in', 'cm', 'ft', 'm'])
  distance_unit: 'in' | 'cm' | 'ft' | 'm';

  @ApiProperty({
    description: 'Mass unit',
    example: 'lb',
    enum: ['lb', 'oz', 'kg', 'g'],
  })
  @IsEnum(['lb', 'oz', 'kg', 'g'])
  mass_unit: 'lb' | 'oz' | 'kg' | 'g';
}

export class CreateShippingLabelDto {
  @ApiProperty({ description: 'Trade ID', example: 1 })
  @Type(() => Number)
  @IsNumber()
  tradeId: number;

  @ApiProperty({ description: 'Sender address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  addressFrom: AddressDto;

  @ApiProperty({ description: 'Recipient address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  addressTo: AddressDto;

  @ApiProperty({ description: 'Parcel details', type: ParcelDto })
  @ValidateNested()
  @Type(() => ParcelDto)
  parcel: ParcelDto;

  @ApiPropertyOptional({
    description: 'Include insurance',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeInsurance?: boolean;

  @ApiPropertyOptional({
    description: 'Insurance amount in USD',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  insuranceAmount?: number;

  @ApiPropertyOptional({
    description: 'Service level token (e.g., usps_priority)',
    example: 'usps_priority',
  })
  @IsOptional()
  @IsString()
  serviceLevelToken?: string;
}
