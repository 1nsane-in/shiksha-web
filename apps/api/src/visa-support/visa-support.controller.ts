import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { VisaSupportService } from "./visa-support.service";
import { CreateVisaCenterDto, UpdateVisaCenterDto, CreateVisaChecklistDto, UpdateVisaChecklistDto, CreateVisaApplicationDto, UpdateVisaApplicationDto, DecideVisaApplicationDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthUser } from "../auth/decorators/user.decorator";

@Controller("visa-support")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VisaSupportController {
  constructor(private readonly visaService: VisaSupportService) {}

  // ===== Visa Centers ===== //
  @Post("centers")
  @Roles("ADMIN", "SUPER_ADMIN")
  createCenter(@Body() dto: CreateVisaCenterDto) {
    return this.visaService.createVisaCenter(dto);
  }
  @Get("centers")
  getAllCenters() {
    return this.visaService.getAllVisaCenters();
  }
  @Get("centers/:id")
  getCenter(@Param("id") id: string) {
    return this.visaService.getVisaCenter(id);
  }
  @Patch("centers/:id")
  @Roles("ADMIN", "SUPER_ADMIN")
  updateCenter(@Param("id") id: string, @Body() dto: UpdateVisaCenterDto) {
    return this.visaService.updateVisaCenter(id, dto);
  }
  @Delete("centers/:id")
  @Roles("ADMIN", "SUPER_ADMIN")
  deleteCenter(@Param("id") id: string) {
    return this.visaService.deleteVisaCenter(id);
  }

  // ===== Visa Checklists ===== //
  @Post("checklists")
  @Roles("ADMIN", "SUPER_ADMIN")
  createChecklist(@Body() dto: CreateVisaChecklistDto) {
    return this.visaService.createVisaChecklist(dto);
  }
  @Get("checklists")
  getAllChecklists(@Query("country") country?: string) {
    return this.visaService.getAllVisaChecklists(country);
  }
  @Get("checklists/:id")
  getChecklist(@Param("id") id: string) {
    return this.visaService.getVisaChecklist(id);
  }
  @Patch("checklists/:id")
  @Roles("ADMIN", "SUPER_ADMIN")
  updateChecklist(@Param("id") id: string, @Body() dto: UpdateVisaChecklistDto) {
    return this.visaService.updateVisaChecklist(id, dto);
  }
  @Delete("checklists/:id")
  @Roles("ADMIN", "SUPER_ADMIN")
  deleteChecklist(@Param("id") id: string) {
    return this.visaService.deleteVisaChecklist(id);
  }

  // ===== Visa Applications ===== //
  @Post("applications")
  createApplication(@Body() dto: CreateVisaApplicationDto) {
    return this.visaService.createVisaApplication(dto);
  }
  @Get("applications/my")
  getMyApplications(@AuthUser("id") userId: string) {
    return this.visaService.getStudentVisaApplications(userId);
  }
  @Get("applications/admin/all")
  @Roles("ADMIN", "SUPER_ADMIN")
  getAllApplications(@Query("status") status?: string) {
    return this.visaService.getAllVisaApplications(status);
  }
  @Get("applications/:id")
  getApplication(@Param("id") id: string) {
    return this.visaService.getVisaApplication(id);
  }
  @Patch("applications/:id")
  updateApplication(@Param("id") id: string, @Body() dto: UpdateVisaApplicationDto) {
    return this.visaService.updateVisaApplication(id, dto);
  }
  @Post("applications/:id/submit")
  submitApplication(@Param("id") id: string) {
    return this.visaService.submitVisaApplication(id);
  }
  @Post("applications/:id/decide")
  @Roles("ADMIN", "SUPER_ADMIN")
  decideApplication(@Param("id") id: string, @Body() dto: DecideVisaApplicationDto, @AuthUser("id") userId: string) {
    return this.visaService.decideVisaApplication(id, dto.decision, userId, dto.remarks);
  }

  // ===== Lookups ===== //
  @Get("countries")
  getCountries() {
    return this.visaService.getVisaCountries();
  }
}