import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DisputeService } from './dispute.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { DisputeResponseDto } from './dto/dispute-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Disputes')
@Controller('disputes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DisputeController {
  constructor(private readonly disputeService: DisputeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new dispute for a trade' })
  @ApiResponse({
    status: 201,
    description: 'Dispute created successfully',
    type: DisputeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Trade not found' })
  async createDispute(
    @CurrentUser('id') userId: number,
    @Body() createDisputeDto: CreateDisputeDto,
  ): Promise<DisputeResponseDto> {
    return this.disputeService.createDispute(userId, createDisputeDto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all disputes opened by the current user' })
  @ApiResponse({
    status: 200,
    description: 'Disputes retrieved successfully',
    type: [DisputeResponseDto],
  })
  async getMyDisputes(
    @CurrentUser('id') userId: number,
  ): Promise<DisputeResponseDto[]> {
    return this.disputeService.getDisputesByUser(userId);
  }

  @Get('trade/:tradeId')
  @ApiOperation({ summary: 'Get all disputes for a specific trade' })
  @ApiParam({ name: 'tradeId', description: 'Trade ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Disputes retrieved successfully',
    type: [DisputeResponseDto],
  })
  async getDisputesByTrade(
    @Param('tradeId', ParseIntPipe) tradeId: number,
  ): Promise<DisputeResponseDto[]> {
    return this.disputeService.getDisputesByTrade(tradeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific dispute by ID' })
  @ApiParam({ name: 'id', description: 'Dispute ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Dispute retrieved successfully',
    type: DisputeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  async getDisputeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DisputeResponseDto> {
    return this.disputeService.getDisputeById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all disputes (Admin only - add role guard if needed)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'All disputes retrieved successfully',
    type: [DisputeResponseDto],
  })
  async getAllDisputes(
    @Query('status') status?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<DisputeResponseDto[]> {
    return this.disputeService.getAllDisputes(status, skip, take);
  }

  @Patch(':id/resolve')
  @ApiOperation({
    summary: 'Resolve or reject a dispute (Admin only - add role guard if needed)',
  })
  @ApiParam({ name: 'id', description: 'Dispute ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Dispute resolved successfully',
    type: DisputeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async resolveDispute(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminUserId: number,
    @Body() resolveDisputeDto: ResolveDisputeDto,
  ): Promise<DisputeResponseDto> {
    return this.disputeService.resolveDispute(id, adminUserId, resolveDisputeDto);
  }

  @Patch(':id/under-review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set dispute status to under review (Admin only - add role guard if needed)',
  })
  @ApiParam({ name: 'id', description: 'Dispute ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Dispute set to under review',
    type: DisputeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async setUnderReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminUserId: number,
  ): Promise<DisputeResponseDto> {
    return this.disputeService.setDisputeUnderReview(id, adminUserId);
  }
}
