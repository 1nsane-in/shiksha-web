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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OnlineExamsService } from './online-exams.service';
import {
  CreateFullExamDto,
  UpdateExamDto,
  CreateQuestionDto,
  UpdateQuestionDto,
  ReorderQuestionsDto,
  PublishExamDto,
} from './dto/create-exam.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';
import { ExamStatus } from './types/exam.types';

@ApiTags('Online Exams')
@ApiBearerAuth()
@Controller('admin/exams')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class OnlineExamsController {
  constructor(private onlineExamsService: OnlineExamsService) {}

  // ──────────────────────────────────────────────────────────────
  // EXAM CRUD
  // ──────────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Create exam (basic info + questions in single request)' })
  async createExam(
    @Body() dto: CreateFullExamDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.onlineExamsService.createFullExam(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update exam basic info' })
  async updateExam(
    @Param('id', ParseUUIDPipe) examId: string,
    @Body() dto: UpdateExamDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.onlineExamsService.updateExam(examId, user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID with questions' })
  async getExam(@Param('id', ParseUUIDPipe) examId: string) {
    return this.onlineExamsService.getExamById(examId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ExamStatus })
  @ApiQuery({ name: 'universityId', required: false, type: String })
  async getAllExams(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ExamStatus,
    @Query('universityId') universityId?: string,
  ) {
    return this.onlineExamsService.getAllExams({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
      universityId,
    });
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish exam (Step 4: Publish)' })
  async publishExam(
    @Param('id', ParseUUIDPipe) examId: string,
    @Body() dto: PublishExamDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.onlineExamsService.publishExam(examId, user.id);
  }

  // ──────────────────────────────────────────────────────────────
  // QUESTION CRUD
  // ──────────────────────────────────────────────────────────────

  @Post(':id/questions')
  @ApiOperation({ summary: 'Add question to exam (Step 3: Question Builder)' })
  async addQuestion(
    @Param('id', ParseUUIDPipe) examId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.onlineExamsService.addQuestion(examId, dto);
  }

  @Put(':id/questions/:questionId')
  @ApiOperation({ summary: 'Update question' })
  async updateQuestion(
    @Param('id', ParseUUIDPipe) examId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.onlineExamsService.updateQuestion(examId, questionId, dto);
  }

  @Delete(':id/questions/:questionId')
  @ApiOperation({ summary: 'Delete question' })
  async deleteQuestion(
    @Param('id', ParseUUIDPipe) examId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.onlineExamsService.deleteQuestion(examId, questionId);
  }

  @Put(':id/questions/reorder')
  @ApiOperation({ summary: 'Reorder questions' })
  async reorderQuestions(
    @Param('id', ParseUUIDPipe) examId: string,
    @Body() dto: ReorderQuestionsDto,
  ) {
    return this.onlineExamsService.reorderQuestions(examId, dto);
  }

}
