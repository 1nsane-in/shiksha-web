import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConsultationController],
  providers: [ConsultationService],
  exports: [ConsultationService],
})
export class ConsultationModule {}
