import { ApiProperty } from '@nestjs/swagger';

export enum TraderTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export class UserTierResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Trader tier',
    example: TraderTier.GOLD,
    enum: TraderTier,
  })
  traderTier: TraderTier;

  @ApiProperty({
    description: 'Trading rating',
    example: 4.5,
  })
  tradingRating: number;

  @ApiProperty({
    description: 'Total number of trades',
    example: 75,
  })
  totalTrades: number;

  @ApiProperty({
    description: 'Number of successful trades',
    example: 72,
  })
  successfulTrades: number;

  constructor(partial: Partial<UserTierResponseDto>) {
    Object.assign(this, partial);
  }
}
