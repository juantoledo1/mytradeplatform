import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import Stripe from 'stripe';

/**
 * Handles incoming webhooks from Stripe.
 * This service is responsible for parsing events, verifying their authenticity,
 * and dispatching them to the appropriate handlers.
 */
@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(PaymentWebhookService.name);
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
  }

  /**
   * Verifies and processes an incoming Stripe webhook event.
   * @param signature The 'Stripe-Signature' header from the request.
   * @param payload The raw request body.
   */
  async handleWebhookEvent(signature: string, payload: Buffer) {
    if (!this.webhookSecret) {
      this.logger.error('Stripe webhook secret is not configured.');
      throw new BadRequestException('Webhook secret not configured.');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook error: ${err.message}`);
    }

    this.logger.log(`Received Stripe event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentIntentSucceeded(paymentIntent);
        break;
      // ... add other event handlers here
      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Handles the 'payment_intent.succeeded' event.
   * This is where you would update your database, fulfill orders, etc.
   * @param paymentIntent The PaymentIntent object from the event.
   */
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    // For now, we will just log the successful payment.
    // In a real application, you would look up the transaction in your database
    // using a metadata field (like transactionId) and update its status.
    this.logger.log(`PaymentIntent ${paymentIntent.id} was successful!`);
    // Example: await this.prisma.walletTransaction.update({ ... });
  }
}
