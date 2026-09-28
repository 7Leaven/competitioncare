import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [AuthModule , MailModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, PrismaService],
})
export class EnrollmentsModule {}
