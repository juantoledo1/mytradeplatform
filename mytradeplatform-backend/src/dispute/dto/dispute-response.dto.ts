import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DisputeResponseDto {
  @ApiProperty({ description: 'Dispute ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Trade ID', example: 1 })
  tradeId: number;

  @ApiProperty({ description: 'User who opened the dispute', example: 2 })
  openedById: number;

  @ApiProperty({ description: 'Reason for dispute', example: 'Item not as described' })
  reason: string;

  @ApiProperty({ description: 'Detailed description', example: 'The item...' })
  description: string;

  @ApiProperty({
    description: 'Dispute status',
    example: 'OPEN',
    enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
  })
  status: string;

  @ApiPropertyOptional({ description: 'Resolution details', example: 'Refund issued' })
  resolution?: string;

  @ApiPropertyOptional({ description: 'ID of user who resolved the dispute', example: 1 })
  resolvedById?: number;

  @ApiPropertyOptional({ description: 'Resolution timestamp' })
  resolvedAt?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<DisputeResponseDto>) {
    Object.assign(this, partial);
  }
}
