import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShippoService } from './shippo.service';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ShippingController],
  providers: [ShippoService],
  exports: [ShippoService],
})
export class ShippingModule {}