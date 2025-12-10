import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
}

export class CreateMessageDto {
  @ApiProperty({
    description: 'Conversation ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  conversationId: number;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, is this item still available?',
  })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({
    description: 'Message type',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional({
    description: 'ID of message being replied to',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  replyToId?: number;
}








