import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedJwtModule } from '../common/shared-jwt.module';
import { Msg91Module } from '../common/services/msg91.module';

@Module({
  imports: [PrismaModule, SharedJwtModule, Msg91Module],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
