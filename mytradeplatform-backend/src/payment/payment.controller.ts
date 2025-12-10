import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { StripeConnectService } from './stripe-connect.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { PaymentWebhookService } from './payment-webhook.service';
import { Req, Headers } from '@nestjs/common';
import { Request } from 'express';



@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeConnectService: StripeConnectService,
    private readonly webhookService: PaymentWebhookService,
  ) {}

  @Get('wallet')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user wallet information' })
  @ApiResponse({
    status: 200,
    description: 'Wallet information retrieved',
    type: WalletResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWallet(@CurrentUser() user: any): Promise<WalletResponseDto> {
    return this.paymentService.getUserWallet(user.id);
  }

  @Get('wallet/summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet summary with recent transactions' })
  @ApiResponse({ status: 200, description: 'Wallet summary retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWalletSummary(@CurrentUser() user: any): Promise<any> {
    return this.paymentService.getWalletSummary(user.id);
  }

  @Get('payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved',
    type: [PaymentMethodResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentMethods(
    @CurrentUser() user: any,
  ): Promise<PaymentMethodResponseDto[]> {
    return this.paymentService.getPaymentMethods(user.id);
  }

  @Post('payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new payment method for the user' })
  @ApiResponse({
    status: 201,
    description: 'The payment method has been successfully created.',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addPaymentMethod(
    @CurrentUser() user: any,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentService.addPaymentMethod(user.id, createPaymentMethodDto);
  }

  @Get('bank-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Bank accounts retrieved',
    type: [BankAccountResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBankAccounts(
    @CurrentUser() user: any,
  ): Promise<BankAccountResponseDto[]> {
    return this.paymentService.getBankAccounts(user.id);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet transactions with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: PaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  async getTransactions(
    @CurrentUser() user: any,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<TransactionResponseDto>> {
    return this.paymentService.getTransactions(user.id, paginationDto);
  }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deposit money to wallet' })
  @ApiResponse({ status: 200, description: 'Deposit successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  async deposit(
    @CurrentUser() user: any,
    @Body() depositRequestDto: DepositRequestDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.paymentService.deposit(
      user.id,
      depositRequestDto,
    );
    return new SuccessResponseDto(result.message);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw money from wallet' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async withdraw(
    @CurrentUser() user: any,
    @Body() withdrawalRequestDto: WithdrawalRequestDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.paymentService.withdraw(
      user.id,
      withdrawalRequestDto,
    );
    return new SuccessResponseDto(result.message);
  }

  @Post('escrow/deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Place amount in escrow' })
  @ApiResponse({
    status: 200,
    description: 'Amount placed in escrow successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Trade not found' })
  async placeInEscrow(
    @CurrentUser() user: any,
    @Body() escrowOperationDto: EscrowOperationDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.paymentService.placeInEscrow(
      user.id,
      escrowOperationDto,
    );
    return new SuccessResponseDto(result.message);
  }

  @Post('escrow/release')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Release amount from escrow' })
  @ApiResponse({
    status: 200,
    description: 'Amount released from escrow successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async releaseFromEscrow(
    @CurrentUser() user: any,
    @Body() escrowOperationDto: EscrowOperationDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.paymentService.releaseFromEscrow(
      user.id,
      escrowOperationDto,
    );
    return new SuccessResponseDto(result.message);
  }

  @Post('escrow/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refund amount from escrow' })
  @ApiResponse({
    status: 200,
    description: 'Amount refunded from escrow successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refundFromEscrow(
    @CurrentUser() user: any,
    @Body() escrowOperationDto: EscrowOperationDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.paymentService.refundFromEscrow(
      user.id,
      escrowOperationDto,
    );
    return new SuccessResponseDto(result.message);
  }

  @Post('shipping/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pay for shipping' })
  @ApiResponse({ status: 200, description: 'Shipping payment successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async payShipping(
    @CurrentUser() user: any,
    @Body('amount') amount: number,
    @Body('tradeId', ParseIntPipe) tradeId: number,
    @Body('description') description?: string,
  ): Promise<SuccessResponseDto> {
    const amountNumber = Number(amount);
    const result = await this.paymentService.payShipping(
      user.id,
      amountNumber,
      tradeId,
      description,
    );
    return new SuccessResponseDto(result.message);
  }

  // Stripe Connect endpoints
  @Post('stripe-connect/create-account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Stripe Connect account for user' })
  @ApiResponse({ status: 200, description: 'Stripe Connect account created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createStripeConnectAccount(@CurrentUser() user: any): Promise<{ accountId: string }> {
    const accountId = await this.stripeConnectService.createConnectAccount(
      user.id,
      user.email,
      user,
    );
    return { accountId };
  }

  @Post('stripe-connect/account-link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create account link for Stripe Connect onboarding' })
  @ApiResponse({ status: 200, description: 'Account link created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createAccountLink(
    @CurrentUser() user: any,
    @Body('accountId') accountId: string,
    @Body('returnUrl') returnUrl: string,
  ): Promise<{ url: string }> {
    const refreshUrl = `${process.env.FRONTEND_URL}/wallet?tab=stripe-connect`;
    const url = await this.stripeConnectService.createAccountLink(
      accountId,
      refreshUrl,
      returnUrl,
    );
    return { url };
  }

  @Get('stripe-connect/account-status/:accountId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Stripe Connect account status' })
  @ApiResponse({ status: 200, description: 'Account status retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAccountStatus(
    @CurrentUser() user: any,
    @Body('accountId') accountId: string,
  ): Promise<any> {
    return this.stripeConnectService.getAccountStatus(accountId);
  }

  @Post('stripe-connect/withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw funds using Stripe Connect' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async stripeConnectWithdraw(
    @CurrentUser() user: any,
    @Body('amount') amount: number,
    @Body('accountId') accountId: string,
  ): Promise<SuccessResponseDto> {
    const payoutId = await this.stripeConnectService.createPayout(
      amount,
      accountId,
      { userId: user.id.toString() },
    );
    return new SuccessResponseDto(`Withdrawal initiated. Payout ID: ${payoutId}`);
  }

  @Get('health')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payment service health check' })
  @ApiResponse({ status: 200, description: 'Payment service is healthy' })
  async healthCheck(): Promise<SuccessResponseDto> {
    return new SuccessResponseDto('Payment API is running');
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook received' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., signature verification failed)' })
  public async handleStripeWebhook(@Req() req: Request & { rawBody: Buffer }) {
    const signature = req.headers['stripe-signature'] as string;
    return this.webhookService.handleWebhookEvent(signature, req.rawBody);
  }
}
