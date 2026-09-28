import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [AuthModule, MailModule],
  controllers: [LessonsController],
  providers: [LessonsService, PrismaService],
})
export class LessonsModule {}