import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LettersService } from './letters.service';
import { UploadLetterDto, UpdateLetterDto } from './dto/letter.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';

@ApiTags('Letters')
@ApiBearerAuth()
@Controller('letters')
export class LettersController {
  constructor(private lettersService: LettersService) {}

  // --- Admission Letter ---

  @Post('admission')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Upload admission letter (Admin)' })
  uploadAdmissionLetter(
    @Body() dto: UploadLetterDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.lettersService.uploadAdmissionLetter(user.id, dto);
  }

  @Get('admission/:applicationId')
  @ApiOperation({ summary: 'Get admission letter by application' })
  getAdmissionLetter(
    @Param('applicationId') applicationId: string,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.lettersService.getAdmissionLetter(
      applicationId,
      user.id,
      user.role,
    );
  }

  @Get('admission/my')
  @ApiOperation({ summary: 'Get my admission letter (Student)' })
  getMyAdmissionLetter(@AuthUser() user: AuthenticatedUser) {
    return this.lettersService.getMyAdmissionLetter(user.id);
  }

  @Post('admission/:applicationId/download')
  @ApiOperation({ summary: 'Track download of admission letter' })
  downloadAdmissionLetter(@Param('applicationId') applicationId: string) {
    return this.lettersService.downloadAdmissionLetter(applicationId);
  }

  // --- Invitation Letter ---

  @Post('invitation')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Upload invitation letter (Admin)' })
  uploadInvitationLetter(
    @Body() dto: UploadLetterDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.lettersService.uploadInvitationLetter(user.id, dto);
  }

  @Get('invitation/:applicationId')
  @ApiOperation({ summary: 'Get invitation letter by application' })
  getInvitationLetter(
    @Param('applicationId') applicationId: string,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.lettersService.getInvitationLetter(
      applicationId,
      user.id,
      user.role,
    );
  }

  @Get('invitation/my')
  @ApiOperation({ summary: 'Get my invitation letter (Student)' })
  getMyInvitationLetter(@AuthUser() user: AuthenticatedUser) {
    return this.lettersService.getMyInvitationLetter(user.id);
  }

  @Post('invitation/:applicationId/download')
  @ApiOperation({ summary: 'Track download of invitation letter' })
  downloadInvitationLetter(@Param('applicationId') applicationId: string) {
    return this.lettersService.downloadInvitationLetter(applicationId);
  }

  @Patch('invitation/:id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update invitation letter settings' })
  updateInvitationLetter(
    @Param('id') id: string,
    @Body() dto: UpdateLetterDto,
  ) {
    return this.lettersService.updateInvitationLetter(id, dto);
  }

  @Post('invitation/:applicationId/approve-access')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Approve invitation letter download + unlock Stage 5',
  })
  approveInvitationAccess(@Param('applicationId') applicationId: string) {
    return this.lettersService.approveInvitationLetterAccess(applicationId);
  }
}
