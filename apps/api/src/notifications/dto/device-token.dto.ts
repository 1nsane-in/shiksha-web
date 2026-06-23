import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceTokenDto {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty({ enum: ['ios', 'android', 'web'] })
  @IsString()
  platform!: string;
}
