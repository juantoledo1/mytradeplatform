import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  conversationId: number;

  @ApiProperty()
  senderId: number;

  @ApiProperty()
  messageType: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  file?: string;

  @ApiPropertyOptional()
  fileName?: string;

  @ApiPropertyOptional()
  fileSize?: number;

  @ApiPropertyOptional()
  mimeType?: string;

  @ApiPropertyOptional()
  replyToId?: number;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiPropertyOptional()
  deliveredAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<MessageResponseDto>) {
    Object.assign(this, partial);
  }
}








