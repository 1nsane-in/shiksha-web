import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Auditable } from '../common/interceptors/audit-log.interceptor';
import {
  UploadDocumentDto,
  VerifyDocumentDto,
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from './documents.dto';

@Controller('student/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
export class StudentDocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  async getMyDocuments(@Request() req: any) {
    return this.documentsService.getMyDocuments(req.user.id);
  }

  @Get('types')
  async getDocumentTypes() {
    return this.documentsService.getDocumentTypes();
  }

  @Post()
  async uploadDocument(@Request() req: any, @Body() dto: UploadDocumentDto) {
    return this.documentsService.uploadMyDocument(req.user.id, dto);
  }
}

@Controller('admin/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminDocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('pending')
  async getPendingDocuments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.documentsService.getPendingDocuments(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('types')
  async getDocumentTypes() {
    return this.documentsService.getDocumentTypes();
  }

  @Get('student/:studentId')
  async getStudentDocuments(@Param('studentId') studentId: string) {
    return this.documentsService.getStudentDocuments(studentId);
  }

  @Put(':id/verify')
  @UseInterceptors(Auditable({ entityType: 'document', entityIdParam: 'id' }))
  async verifyDocument(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: VerifyDocumentDto,
  ) {
    return this.documentsService.verifyDocument(id, req.user.id, dto);
  }

  @Put(':id/reupload')
  @UseInterceptors(Auditable({ entityType: 'document', entityIdParam: 'id' }))
  async markForReupload(
    @Param('id') id: string,
    @Body('remarks') remarks: string,
  ) {
    return this.documentsService.markForReupload(id, remarks);
  }

  @Post('types')
  @UseInterceptors(Auditable({ entityType: 'document_type' }))
  async createDocumentType(@Body() dto: CreateDocumentTypeDto) {
    return this.documentsService.createDocumentType(dto);
  }

  @Put('types/:id')
  @UseInterceptors(Auditable({ entityType: 'document_type', entityIdParam: 'id' }))
  async updateDocumentType(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentTypeDto,
  ) {
    return this.documentsService.updateDocumentType(id, dto);
  }

  @Delete('types/:id')
  @UseInterceptors(Auditable({ entityType: 'document_type', entityIdParam: 'id' }))
  async deleteDocumentType(@Param('id') id: string) {
    return this.documentsService.deleteDocumentType(id);
  }
}
