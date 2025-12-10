import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';

export enum DisputeResolutionAction {
  RESOLVE = 'RESOLVE',
  REJECT = 'REJECT',
}

export class ResolveDisputeDto {
  @ApiProperty({
    description: 'Resolution action',
    example: DisputeResolutionAction.RESOLVE,
    enum: DisputeResolutionAction,
  })
  @IsEnum(DisputeResolutionAction)
  action: DisputeResolutionAction;

  @ApiProperty({
    description: 'Resolution details',
    example: 'Refund issued to buyer. Items to be returned.',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  resolution: string;
}
