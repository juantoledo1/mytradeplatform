import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto, DisputeResolutionAction } from './dto/resolve-dispute.dto';
import { DisputeResponseDto } from './dto/dispute-response.dto';

@Injectable()
export class DisputeService {
  private readonly logger = new Logger(DisputeService.name);

  constructor(private prisma: PrismaService) {}

  async createDispute(
    userId: number,
    createDisputeDto: CreateDisputeDto,
  ): Promise<DisputeResponseDto> {
    const { tradeId, reason, description } = createDisputeDto;

    // Verify trade exists and user is part of it
    const trade = await this.prisma.trade.findFirst({
      where: {
        id: tradeId,
        OR: [{ traderOfferingId: userId }, { traderReceivingId: userId }],
      },
    });

    if (!trade) {
      throw new NotFoundException(
        'Trade not found or you are not authorized to dispute it',
      );
    }

    // Check if trade is in a valid state for disputes
    if (
      !['ACCEPTED', 'SHIPPING', 'DELIVERED', 'COMPLETED'].includes(
        trade.status,
      )
    ) {
      throw new BadRequestException(
        `Cannot open dispute for trade in status: ${trade.status}`,
      );
    }

    // Check if there's already an open dispute for this trade
    const existingDispute = await this.prisma.dispute.findFirst({
      where: {
        tradeId,
        status: {
          in: ['OPEN', 'UNDER_REVIEW'],
        },
      },
    });

    if (existingDispute) {
      throw new BadRequestException(
        'There is already an open dispute for this trade',
      );
    }

    // Create dispute
    const dispute = await this.prisma.dispute.create({
      data: {
        tradeId,
        openedById: userId,
        reason,
        description,
        status: 'OPEN',
      },
    });

    // Update trade status to DISPUTED
    await this.prisma.trade.update({
      where: { id: tradeId },
      data: { status: 'DISPUTED' },
    });

    this.logger.log(
      `Dispute ${dispute.id} created for trade ${tradeId} by user ${userId}`,
    );

    return new DisputeResponseDto(dispute);
  }

  async getDisputeById(disputeId: number): Promise<DisputeResponseDto> {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return new DisputeResponseDto(dispute);
  }

  async getDisputesByTrade(tradeId: number): Promise<DisputeResponseDto[]> {
    const disputes = await this.prisma.dispute.findMany({
      where: { tradeId },
      orderBy: { createdAt: 'desc' },
    });

    return disputes.map((dispute) => new DisputeResponseDto(dispute));
  }

  async getDisputesByUser(userId: number): Promise<DisputeResponseDto[]> {
    const disputes = await this.prisma.dispute.findMany({
      where: {
        openedById: userId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return disputes.map((dispute) => new DisputeResponseDto(dispute));
  }

  async getAllDisputes(
    status?: string,
    skip?: string,
    take?: string,
  ): Promise<DisputeResponseDto[]> {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 50;
    const where = status ? { status: status as any } : {};

    const disputes = await this.prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: skipNum,
      take: takeNum,
    });

    return disputes.map((dispute) => new DisputeResponseDto(dispute));
  }

  async resolveDispute(
    disputeId: number,
    adminUserId: number,
    resolveDisputeDto: ResolveDisputeDto,
  ): Promise<DisputeResponseDto> {
    const { action, resolution } = resolveDisputeDto;

    // Find dispute
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { trade: true },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Check if dispute is still open or under review
    if (!['OPEN', 'UNDER_REVIEW'].includes(dispute.status)) {
      throw new BadRequestException(
        `Cannot resolve dispute with status: ${dispute.status}`,
      );
    }

    // Determine new dispute status based on action
    const newDisputeStatus =
      action === DisputeResolutionAction.RESOLVE ? 'RESOLVED' : 'REJECTED';

    // Determine new trade status
    let newTradeStatus = dispute.trade.status;
    if (action === DisputeResolutionAction.RESOLVE) {
      // When dispute is resolved, revert trade to previous state or mark as completed
      newTradeStatus = 'COMPLETED';
    } else {
      // When dispute is rejected, revert to previous state before dispute
      // This logic can be customized based on business requirements
      newTradeStatus = 'COMPLETED';
    }

    // Update dispute
    const updatedDispute = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: newDisputeStatus,
        resolution,
        resolvedById: adminUserId,
        resolvedAt: new Date(),
      },
    });

    // Update trade status
    await this.prisma.trade.update({
      where: { id: dispute.tradeId },
      data: { status: newTradeStatus },
    });

    this.logger.log(
      `Dispute ${disputeId} ${action.toLowerCase()}d by user ${adminUserId}`,
    );

    return new DisputeResponseDto(updatedDispute);
  }

  async setDisputeUnderReview(
    disputeId: number,
    adminUserId: number,
  ): Promise<DisputeResponseDto> {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    if (dispute.status !== 'OPEN') {
      throw new BadRequestException(
        `Cannot set dispute to under review from status: ${dispute.status}`,
      );
    }

    const updatedDispute = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'UNDER_REVIEW',
      },
    });

    this.logger.log(
      `Dispute ${disputeId} set to under review by user ${adminUserId}`,
    );

    return new DisputeResponseDto(updatedDispute);
  }
}
