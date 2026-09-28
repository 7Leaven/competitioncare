import { Module } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { AttemptsController } from './attempts.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [AuthModule, MailModule],
  controllers: [AttemptsController],
  providers: [AttemptsService, PrismaService],
})
export class AttemptsModule {}
