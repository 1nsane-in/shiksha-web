import { Module } from '@nestjs/common';
import { UniversitiesController, AdminUniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [UniversitiesController, AdminUniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
