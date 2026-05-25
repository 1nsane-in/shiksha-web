import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { VisaSupportController } from "./visa-support.controller";
import { VisaSupportService } from "./visa-support.service";

@Module({
  imports: [PrismaModule],
  controllers: [VisaSupportController],
  providers: [VisaSupportService],
  exports: [VisaSupportService],
})
export class VisaSupportModule {}