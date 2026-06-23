import { Module } from '@nestjs/common';
import { UniversityRequestService } from './university-request.service';
import { UniversityRequestController } from './university-request.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UniversityRequestController],
  providers: [UniversityRequestService],
  exports: [UniversityRequestService],
})
export class UniversityRequestModule {}
