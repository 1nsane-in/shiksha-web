import { Module } from '@nestjs/common';
import {
  StudentDocumentsController,
  AdminDocumentsController,
} from './documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentDocumentsController, AdminDocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
