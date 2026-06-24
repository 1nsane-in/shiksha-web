import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UniversitiesModule } from './universities/universities.module';
import { StudentsModule } from './students/students.module';
import { DocumentsModule } from './documents/documents.module';
import { CommonModule } from './common/common.module';
import { SharedJwtModule } from './common/shared-jwt.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AdminModule } from './admin/admin.module';
import { ApplicationsModule } from './applications/applications.module';
import { LettersModule } from './letters/letters.module';
import { PaymentsModule } from './payments/payments.module';
import { ExamsModule } from './exams/exams.module';
import { TicketsModule } from './tickets/tickets.module';
import { DeviceTokenModule } from './notifications/device-token.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { VisaSupportModule } from './visa-support/visa-support.module';
import { RateLimitingModule } from './common/rate-limiting/rate-limiting.module';
import { GalleryModule } from './gallery/gallery.module';
import { ConsultationModule } from './consultation/consultation.module';
import { ParentsModule } from './parents/parents.module';
import { UniversityRequestModule } from './university-requests/university-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    RateLimitingModule,
    SharedJwtModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    UniversitiesModule,
    StudentsModule,
    ApplicationsModule,
    DocumentsModule,
    CommonModule,
    AdminModule,
    LettersModule,
    PaymentsModule,
    ExamsModule,
    TicketsModule,
    DeviceTokenModule,
    TimelineModule,
    VisaSupportModule,
    GalleryModule,
    ConsultationModule,
    UniversityRequestModule,
    ParentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
