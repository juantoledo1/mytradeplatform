import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ShippoService, ShippingAddress, PackageDimensions, ShippingRate, ShippingLabel } from './shippo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SuccessResponseDto } from '../common/dto/response.dto';

@ApiTags('Shipping')
@Controller('shipping')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShippingController {
  constructor(private readonly shippoService: ShippoService) {}

  @Post('rates')
  @ApiOperation({ summary: 'Get shipping rates for a package' })
  @ApiResponse({
    status: 200,
    description: 'Shipping rates retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getShippingRates(
    @CurrentUser() user: any,
    @Body() body: {
      fromAddress: ShippingAddress;
      toAddress: ShippingAddress;
      dimensions: PackageDimensions;
      carriers?: string[];
    },
  ): Promise<ShippingRate[]> {
    return this.shippoService.getShippingRates(
      body.fromAddress,
      body.toAddress,
      body.dimensions,
      body.carriers,
    );
  }

  @Post('label')
  @ApiOperation({ summary: 'Create a shipping label' })
  @ApiResponse({
    status: 201,
    description: 'Shipping label created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createShippingLabel(
    @CurrentUser() user: any,
    @Body() body: { rateId: string; labelFormat?: string },
  ): Promise<ShippingLabel> {
    return this.shippoService.createShippingLabel(
      body.rateId,
      body.labelFormat,
    );
  }

  @Get('track/:carrier/:trackingNumber')
  @ApiOperation({ summary: 'Track a shipment' })
  @ApiResponse({
    status: 200,
    description: 'Tracking information retrieved',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async trackShipment(
    @CurrentUser() user: any,
    @Param('carrier') carrier: string,
    @Param('trackingNumber') trackingNumber: string,
  ): Promise<any> {
    return this.shippoService.trackShipment(trackingNumber, carrier);
  }

  @Post('validate-address')
  @ApiOperation({ summary: 'Validate a shipping address' })
  @ApiResponse({
    status: 200,
    description: 'Address validation result',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async validateAddress(
    @CurrentUser() user: any,
    @Body() address: ShippingAddress,
  ): Promise<{ valid: boolean; suggestions?: any[] }> {
    return this.shippoService.validateAddress(address);
  }

  @Get('carriers')
  @ApiOperation({ summary: 'Get available carriers' })
  @ApiResponse({
    status: 200,
    description: 'Available carriers retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAvailableCarriers(
    @CurrentUser() user: any,
  ): Promise<string[]> {
    return this.shippoService.getAvailableCarriers();
  }

  @Post('calculate-cost')
  @ApiOperation({ summary: 'Calculate shipping cost for a specific service' })
  @ApiResponse({
    status: 200,
    description: 'Shipping cost calculated',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async calculateShippingCost(
    @CurrentUser() user: any,
    @Body() body: {
      fromAddress: ShippingAddress;
      toAddress: ShippingAddress;
      dimensions: PackageDimensions;
      service: string;
    },
  ): Promise<{ cost: number; currency: string; estimated_days: number }> {
    return this.shippoService.calculateShippingCost(
      body.fromAddress,
      body.toAddress,
      body.dimensions,
      body.service,
    );
  }

  @Get('health')
  @SetMetadata('isPublic', true)
  @ApiOperation({ summary: 'Shipping service health check' })
  @ApiResponse({ status: 200, description: 'Shipping service is healthy' })
  async healthCheck(): Promise<SuccessResponseDto> {
    return new SuccessResponseDto('Shipping API is running');
  }
}