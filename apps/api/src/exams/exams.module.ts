import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { OnlineExamsController } from './online-exams.controller';
import { OnlineExamsService } from './online-exams.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExamsController, OnlineExamsController],
  providers: [ExamsService, OnlineExamsService],
  exports: [ExamsService, OnlineExamsService],
})
export class ExamsModule {}
