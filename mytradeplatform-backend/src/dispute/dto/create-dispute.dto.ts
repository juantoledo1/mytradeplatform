import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, Min, MaxLength, MinLength } from 'class-validator';

export class CreateDisputeDto {
  @ApiProperty({
    description: 'Trade ID to dispute',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tradeId: number;

  @ApiProperty({
    description: 'Reason for the dispute',
    example: 'Item not as described',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  reason: string;

  @ApiProperty({
    description: 'Detailed description of the dispute',
    example: 'The item I received is significantly different from what was shown in the photos...',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;
}
