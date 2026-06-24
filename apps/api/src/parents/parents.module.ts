import { Module } from '@nestjs/common';
import { ParentsController } from './parents.controller';
import { ParentsAuthController } from './parents-auth.controller';
import { ParentsAdminController } from './parents-admin.controller';
import { ParentsService } from './parents.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedJwtModule } from '../common/shared-jwt.module';

@Module({
  imports: [PrismaModule, SharedJwtModule],
  controllers: [
    ParentsController,
    ParentsAuthController,
    ParentsAdminController,
  ],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}
