import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeConnectService {
  private readonly logger = new Logger(StripeConnectService.name);
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured - Stripe Connect will fail');
    }
    this.stripe = new Stripe(stripeSecretKey || '', {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a Stripe Connect account for a user
   */
  async createConnectAccount(userId: number, userEmail: string, userData: any): Promise<string> {
    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'US', // Default to US, should be configurable
        email: userEmail,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          email: userEmail,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
        metadata: {
          userId: userId.toString(),
        },
      });

      this.logger.log(`Stripe Connect account created: ${account.id} for user ${userId}`);
      return account.id;
    } catch (error) {
      this.logger.error(`Failed to create Stripe Connect account for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create account link for onboarding
   */
  async createAccountLink(accountId: string, refreshUrl: string, returnUrl: string): Promise<string> {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink.url;
    } catch (error) {
      this.logger.error(`Failed to create account link for ${accountId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get account status
   */
  async getAccountStatus(accountId: string): Promise<any> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      return {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        requirements: account.requirements,
      };
    } catch (error) {
      this.logger.error(`Failed to get account status for ${accountId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create transfer to connected account
   */
  async createTransfer(
    amount: number,
    destinationAccountId: string,
    transferGroup: string,
    metadata: any = {}
  ): Promise<string> {
    try {
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        destination: destinationAccountId,
        transfer_group: transferGroup,
        metadata,
      });

      this.logger.log(`Transfer created: ${transfer.id} for amount $${amount}`);
      return transfer.id;
    } catch (error) {
      this.logger.error(`Failed to create transfer: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create application fee for platform (deprecated - now handled in Payment Intents)
   * This method is kept for backward compatibility but does nothing
   */
  async createApplicationFee(
    amount: number,
    chargeId: string,
    metadata: any = {}
  ): Promise<string> {
    this.logger.warn('createApplicationFee is deprecated - application fees are now handled in Payment Intents');
    // Return a mock ID for backward compatibility
    return `app_fee_${Date.now()}`;
  }

  /**
   * Create payment intent for connected account
   */
  async createPaymentIntent(
    amount: number,
    connectedAccountId: string,
    applicationFeeAmount: number,
    metadata: any = {}
  ): Promise<any> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        application_fee_amount: Math.round(applicationFeeAmount * 100),
        transfer_data: {
          destination: connectedAccountId,
        },
        metadata,
      }, {
        stripeAccount: connectedAccountId,
      });

      this.logger.log(`Payment intent created: ${paymentIntent.id} for connected account ${connectedAccountId}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Failed to create payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get balance for connected account
   */
  async getAccountBalance(accountId: string): Promise<any> {
    try {
      const balance = await this.stripe.balance.retrieve({
        stripeAccount: accountId,
      });

      return balance;
    } catch (error) {
      this.logger.error(`Failed to get balance for account ${accountId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create payout for connected account
   */
  async createPayout(
    amount: number,
    accountId: string,
    metadata: any = {}
  ): Promise<string> {
    try {
      const payout = await this.stripe.payouts.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata,
      }, {
        stripeAccount: accountId,
      });

      this.logger.log(`Payout created: ${payout.id} for amount $${amount}`);
      return payout.id;
    } catch (error) {
      this.logger.error(`Failed to create payout: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get platform balance
   */
  async getPlatformBalance(): Promise<any> {
    try {
      const balance = await this.stripe.balance.retrieve();
      return balance;
    } catch (error) {
      this.logger.error(`Failed to get platform balance: ${error.message}`);
      throw error;
    }
  }
}
