import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DeviceTokenController } from './device-token.controller';
import { DeviceTokenService } from './device-token.service';

@Module({
  imports: [PrismaModule],
  controllers: [DeviceTokenController],
  providers: [DeviceTokenService],
  exports: [DeviceTokenService],
})
export class DeviceTokenModule {}
