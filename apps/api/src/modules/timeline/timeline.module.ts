import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TimelineController } from './timeline.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TimelineController],
})
export class TimelineModule {}
