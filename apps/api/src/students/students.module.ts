import { Module } from '@nestjs/common';
import { StudentController, AdminStudentsController } from './students.controller';
import { StudentDashboardController } from './dashboard.controller';
import { StudentsService } from './students.service';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentController, AdminStudentsController, StudentDashboardController],
  providers: [StudentsService, DashboardService],
  exports: [StudentsService],
})
export class StudentsModule {}
