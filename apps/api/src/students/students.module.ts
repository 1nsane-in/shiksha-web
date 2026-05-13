import { Module } from '@nestjs/common';
import { StudentController, AdminStudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentController, AdminStudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
