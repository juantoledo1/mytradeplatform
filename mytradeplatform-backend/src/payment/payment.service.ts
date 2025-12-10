import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { DepositRequestDto } from './dto/deposit.dto';
import { WithdrawalRequestDto } from './dto/withdrawal.dto';
import { EscrowOperationDto } from './dto/escrow.dto';
import {
  WalletResponseDto,
  PaymentMethodResponseDto,
  BankAccountResponseDto,
  TransactionResponseDto,
} from './dto/wallet-response.dto';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../common/dto/pagination.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      this.logger.warn(
        'STRIPE_SECRET_KEY not configured - payment processing will fail',
      );
    }
    this.stripe = new Stripe(stripeSecretKey || '', {
      apiVersion: '2023-10-16',
    });
  }

  private convertWalletToResponseDto(wallet: any): WalletResponseDto {
    return new WalletResponseDto({
      ...wallet,
      availableBalance: Number(wallet.availableBalance),
      escrowBalance: Number(wallet.escrowBalance),
      totalDeposited: Number(wallet.totalDeposited),
      totalWithdrawn: Number(wallet.totalWithdrawn),
      totalShippingPaid: Number(wallet.totalShippingPaid),
      withdrawalLimitDaily: Number(wallet.withdrawalLimitDaily),
      withdrawalLimitMonthly: Number(wallet.withdrawalLimitMonthly),
    });
  }

  private convertTransactionToResponseDto(
    transaction: any,
  ): TransactionResponseDto {
    return new TransactionResponseDto({
      ...transaction,
      amount: Number(transaction.amount),
      platformFee: Number(transaction.platformFee),
      stripeFee: Number(transaction.stripeFee),
      balanceBefore: transaction.balanceBefore
        ? Number(transaction.balanceBefore)
        : undefined,
      balanceAfter: transaction.balanceAfter
        ? Number(transaction.balanceAfter)
        : undefined,
    });
  }

  /**
   * Get or create Stripe Customer ID for a user
   */
  private async getOrCreateStripeCustomer(userId: number): Promise<string> {
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (wallet?.stripeCustomerId) {
      return wallet.stripeCustomerId;
    }

    // Create Stripe customer
    const user = wallet?.user || (await this.prisma.user.findUnique({ where: { id: userId } }));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: userId.toString(),
      },
    });

    // Update wallet with Stripe customer ID
    if (wallet) {
      await this.prisma.userWallet.update({
        where: { id: wallet.id },
        data: { stripeCustomerId: customer.id },
      });
    } else {
      await this.prisma.userWallet.create({
        data: {
          userId,
          stripeCustomerId: customer.id,
        },
      });
    }

    return customer.id;
  }

  async getUserWallet(userId: number): Promise<WalletResponseDto> {
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = await this.prisma.userWallet.create({
        data: { userId },
      });
      return this.convertWalletToResponseDto(newWallet);
    }

    return this.convertWalletToResponseDto(wallet);
  }

  async getPaymentMethods(userId: number): Promise<PaymentMethodResponseDto[]> {
    const paymentMethods = await this.prisma.paymentMethod.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return paymentMethods.map((method) => new PaymentMethodResponseDto(method));
  }

  async getBankAccounts(userId: number): Promise<BankAccountResponseDto[]> {
    const bankAccounts = await this.prisma.bankAccount.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return bankAccounts.map((account) => new BankAccountResponseDto(account));
  }

  /**
   * Adds a new payment method for a user.
   * It retrieves the payment method details from Stripe to validate it,
   * attaches the payment method to the corresponding Stripe Customer,
   * and then saves a reference to it in the local database.
   * @param userId The ID of the user adding the payment method.
   * @param createPaymentMethodDto DTO containing the Stripe PaymentMethod ID from the client-side.
   * @returns The newly created payment method entity, wrapped in a response DTO.
   */
  async addPaymentMethod(
    userId: number,
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    const { stripePaymentMethodId } = createPaymentMethodDto;

    // 1. Retrieve payment method details from Stripe to verify it and get card details
    const stripePaymentMethod = await this.stripe.paymentMethods.retrieve(
      stripePaymentMethodId,
    );

    if (!stripePaymentMethod || !stripePaymentMethod.card) {
      throw new BadRequestException(
        'Invalid or non-card Stripe Payment Method ID.',
      );
    }

    // 2. Ensure the user has a Stripe Customer ID in our system
    const stripeCustomerId = await this.getOrCreateStripeCustomer(userId);

    // 3. Attach the payment method to the customer in Stripe for future use
    await this.stripe.paymentMethods.attach(stripePaymentMethodId, {
      customer: stripeCustomerId,
    });

    // 4. Save the payment method to our local database
    const newPaymentMethod = await this.prisma.paymentMethod.create({
      data: {
        userId,
        stripePaymentMethodId,
        paymentType: 'CARD',
        brand: stripePaymentMethod.card.brand,
        lastFour: stripePaymentMethod.card.last4,
        isDefault: false, // Future improvement: logic to set a default method
      },
    });

    this.logger.log(
      `Added new payment method ${newPaymentMethod.id} for user ${userId}`,
    );

    return new PaymentMethodResponseDto(newPaymentMethod);
  }

  async getTransactions(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<TransactionResponseDto>> {
    const { page, limit, skip } = paginationDto;

    // Get user's wallet
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          paymentMethod: true,
        },
      }),
      this.prisma.walletTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    const transactionDtos = transactions.map((transaction) =>
      this.convertTransactionToResponseDto(transaction),
    );
    const meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };

    return new PaginatedResponseDto(transactionDtos, meta);
  }

  async deposit(
    userId: number,
    depositRequestDto: DepositRequestDto,
  ): Promise<{ message: string; transactionId: number }> {
    const { amount, paymentMethodId, description } = depositRequestDto;

    // Get or create wallet
    let wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await this.prisma.userWallet.create({
        data: { userId },
      });
    }

    // Check if payment method exists and belongs to user
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId,
        isActive: true,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found or inactive');
    }

    // Get or create Stripe customer
    const stripeCustomerId = await this.getOrCreateStripeCustomer(userId);

    // Create transaction record
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        transactionType: 'DEPOSIT',
        amount,
        status: 'PENDING',
        description: description || 'Wallet deposit',
        paymentMethodId,
        balanceBefore: wallet.availableBalance,
      },
    });

    try {
      // Create Stripe Payment Intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: stripeCustomerId,
        payment_method: paymentMethod.stripePaymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        metadata: {
          userId: userId.toString(),
          transactionId: transaction.id.toString(),
          type: 'deposit',
        },
      });

      // Calculate fees (Stripe standard fee: 2.9% + $0.30)
      const stripeFee = Math.round(amount * 0.029 + 0.3 * 100) / 100;
      const platformFee = 0; // No platform fee for deposits

      // Update transaction with Stripe data
      await this.prisma.walletTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          stripePaymentIntentId: paymentIntent.id,
          stripeChargeId: paymentIntent.latest_charge as string,
          stripeFee,
          platformFee,
          balanceAfter: Number(wallet.availableBalance) + amount,
          completedAt: new Date(),
        },
      });

      // Update wallet balance
      await this.prisma.userWallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: Number(wallet.availableBalance) + amount,
          totalDeposited: Number(wallet.totalDeposited) + amount,
        },
      });

      this.logger.log(
        `Deposit successful: User ${userId}, Amount $${amount}, PaymentIntent ${paymentIntent.id}`,
      );

      return {
        message: 'Deposit successful',
        transactionId: transaction.id,
      };
    } catch (error) {
      // Update transaction status to FAILED
      await this.prisma.walletTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
        },
      });

      this.logger.error(
        `Deposit failed for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      throw new BadRequestException(
        `Deposit failed: ${error instanceof Error ? error.message : 'Payment processing error'}`,
      );
    }
  }

  async withdraw(
    userId: number,
    withdrawalRequestDto: WithdrawalRequestDto,
  ): Promise<{ message: string; transactionId: number }> {
    const { amount, bankAccountId, description } = withdrawalRequestDto;

    // Get wallet
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if user has sufficient balance
    if (Number(wallet.availableBalance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Check daily withdrawal limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWithdrawals = await this.prisma.walletTransaction.aggregate({
      where: {
        walletId: wallet.id,
        transactionType: 'WITHDRAWAL',
        status: 'COMPLETED',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: { amount: true },
    });

    const totalTodayWithdrawals = Number(todayWithdrawals._sum.amount) || 0;
    if (totalTodayWithdrawals + amount > Number(wallet.withdrawalLimitDaily)) {
      throw new BadRequestException('Daily withdrawal limit exceeded');
    }

    // Check monthly withdrawal limit
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthWithdrawals = await this.prisma.walletTransaction.aggregate({
      where: {
        walletId: wallet.id,
        transactionType: 'WITHDRAWAL',
        status: 'COMPLETED',
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { amount: true },
    });

    const totalMonthWithdrawals = Number(monthWithdrawals._sum.amount) || 0;
    if (
      totalMonthWithdrawals + amount >
      Number(wallet.withdrawalLimitMonthly)
    ) {
      throw new BadRequestException('Monthly withdrawal limit exceeded');
    }

    // Get bank account if specified
    let bankAccount = null;
    if (bankAccountId) {
      bankAccount = await this.prisma.bankAccount.findFirst({
        where: {
          id: bankAccountId,
          userId,
          isActive: true,
        },
      });

      if (!bankAccount) {
        throw new NotFoundException('Bank account not found or inactive');
      }
    } else {
      // Get default bank account
      bankAccount = await this.prisma.bankAccount.findFirst({
        where: {
          userId,
          isDefault: true,
          isActive: true,
        },
      });

      if (!bankAccount) {
        throw new BadRequestException(
          'No bank account specified and no default account found',
        );
      }
    }

    // Create transaction record
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        transactionType: 'WITHDRAWAL',
        amount,
        status: 'PENDING',
        description: description || 'Wallet withdrawal',
        balanceBefore: wallet.availableBalance,
      },
    });

    try {
      // Create Stripe Payout to bank account
      const payout = await this.stripe.payouts.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        destination: bankAccount.stripeBankAccountId,
        metadata: {
          userId: userId.toString(),
          transactionId: transaction.id.toString(),
          type: 'withdrawal',
        },
        statement_descriptor: 'MyTradePlatform Withdrawal',
      });

      // Calculate fees (Stripe payout fee: $0.25 for instant, $0 for standard)
      const stripeFee = 0; // Standard payout has no fee
      const platformFee = 0; // No platform fee for withdrawals

      // Update transaction with Stripe data
      await this.prisma.walletTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          stripePaymentIntentId: payout.id,
          stripeFee,
          platformFee,
          balanceAfter: Number(wallet.availableBalance) - amount,
          completedAt: new Date(),
        },
      });

      // Update wallet balance
      await this.prisma.userWallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: Number(wallet.availableBalance) - amount,
          totalWithdrawn: Number(wallet.totalWithdrawn) + amount,
        },
      });

      this.logger.log(
        `Withdrawal successful: User ${userId}, Amount $${amount}, Payout ${payout.id}`,
      );

      return {
        message: 'Withdrawal successful',
        transactionId: transaction.id,
      };
    } catch (error) {
      // Update transaction status to FAILED
      await this.prisma.walletTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
        },
      });

      this.logger.error(
        `Withdrawal failed for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      throw new BadRequestException(
        `Withdrawal failed: ${error instanceof Error ? error.message : 'Payout processing error'}`,
      );
    }
  }

  async placeInEscrow(
    userId: number,
    escrowOperationDto: EscrowOperationDto,
  ): Promise<{ message: string; transactionId: number }> {
    const { amount, tradeId, description } = escrowOperationDto;

    // Get wallet
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if user has sufficient available balance
    if (Number(wallet.availableBalance) < amount) {
      throw new BadRequestException(
        'Insufficient available balance for escrow',
      );
    }

    // Verify trade exists
    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    // Create transaction record
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        transactionType: 'ESCROW_DEPOSIT',
        amount,
        status: 'PENDING',
        description: description || `Escrow deposit for trade ${tradeId}`,
        tradeId,
        balanceBefore: wallet.availableBalance,
      },
    });

    // Update wallet balances
    await this.prisma.userWallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: Number(wallet.availableBalance) - amount,
        escrowBalance: Number(wallet.escrowBalance) + amount,
      },
    });

    // Mark transaction as completed
    await this.prisma.walletTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        balanceAfter: Number(wallet.availableBalance) - amount,
        completedAt: new Date(),
      },
    });

    return {
      message: 'Amount placed in escrow successfully',
      transactionId: transaction.id,
    };
  }

  async releaseFromEscrow(
    userId: number,
    escrowOperationDto: EscrowOperationDto,
  ): Promise<{ message: string; transactionId: number }> {
    const { amount, tradeId, description } = escrowOperationDto;

    // Get wallet
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if user has sufficient escrow balance
    if (Number(wallet.escrowBalance) < amount) {
      throw new BadRequestException('Insufficient escrow balance');
    }

    // Create transaction record
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        transactionType: 'ESCROW_RELEASE',
        amount,
        status: 'PENDING',
        description: description || `Escrow release for trade ${tradeId}`,
        tradeId,
        balanceBefore: wallet.availableBalance,
      },
    });

    // Update wallet balances
    await this.prisma.userWallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: Number(wallet.availableBalance) + amount,
        escrowBalance: Number(wallet.escrowBalance) - amount,
      },
    });

    // Mark transaction as completed
    await this.prisma.walletTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        balanceAfter: Number(wallet.availableBalance) + amount,
        completedAt: new Date(),
      },
    });

    return {
      message: 'Amount released from escrow successfully',
      transactionId: transaction.id,
    };
  }

  async refundFromEscrow(
    userId: number,
    escrowOperationDto: EscrowOperationDto,
  ): Promise<{ message: string; transactionId: number }> {
    const { amount, tradeId, description } = escrowOperationDto;

    // Get wallet
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if user has sufficient escrow balance
    if (Number(wallet.escrowBalance) < amount) {
      throw new BadRequestException('Insufficient escrow balance');
    }

    // Create transaction record
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        transactionType: 'ESCROW_REFUND',
        amount,
        status: 'PENDING',
        description: description || `Escrow refund for trade ${tradeId}`,
        tradeId,
        balanceBefore: wallet.availableBalance,
      },
    });

    // Update wallet balances
    await this.prisma.userWallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: Number(wallet.availableBalance) + amount,
        escrowBalance: Number(wallet.escrowBalance) - amount,
      },
    });

    // Mark transaction as completed
    await this.prisma.walletTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        balanceAfter: Number(wallet.availableBalance) + amount,
        completedAt: new Date(),
      },
    });

    return {
      message: 'Amount refunded from escrow successfully',
      transactionId: transaction.id,
    };
  }

  async payShipping(
    userId: number,
    amount: number,
    tradeId: number,
    description?: string,
  ): Promise<{ message: string; transactionId: number }> {
    // Get wallet
    const wallet = await this.prisma.userWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if user has sufficient available balance
    if (Number(wallet.availableBalance) < amount) {
      throw new BadRequestException(
        'Insufficient available balance for shipping payment',
      );
    }

    // Create transaction record
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        transactionType: 'SHIPPING_PAYMENT',
        amount,
        status: 'PENDING',
        description: description || `Shipping payment for trade ${tradeId}`,
        tradeId,
        balanceBefore: wallet.availableBalance,
      },
    });

    // Update wallet balances
    await this.prisma.userWallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: Number(wallet.availableBalance) - amount,
        totalShippingPaid: Number(wallet.totalShippingPaid) + amount,
      },
    });

    // Mark transaction as completed
    await this.prisma.walletTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        balanceAfter: Number(wallet.availableBalance) - amount,
        completedAt: new Date(),
      },
    });

    return {
      message: 'Shipping payment successful',
      transactionId: transaction.id,
    };
  }

  async getWalletSummary(userId: number): Promise<{
    wallet: WalletResponseDto;
    recentTransactions: TransactionResponseDto[];
    withdrawalLimits: {
      daily: number;
      monthly: number;
    };
  }> {
    const wallet = await this.getUserWallet(userId);

    const recentTransactions = await this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      wallet,
      recentTransactions: recentTransactions.map((t) =>
        this.convertTransactionToResponseDto(t),
      ),
      withdrawalLimits: {
        daily: wallet.withdrawalLimitDaily,
        monthly: wallet.withdrawalLimitMonthly,
      },
    };
  }
}
