import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentWebhookService } from './payment-webhook.service';
import { PaymentService } from './payment.service';
import { StripeConnectService } from './stripe-connect.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeConnectService, PaymentWebhookService],
  exports: [PaymentService, StripeConnectService],
})
export class PaymentModule {}
