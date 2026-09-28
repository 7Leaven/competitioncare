import { Module } from '@nestjs/common';
import { ProgressDashboardService } from './progress-dashboard.service';
import { ProgressDashboardController } from './progress-dashboard.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProgressDashboardController],
  providers: [ProgressDashboardService, PrismaService],
})
export class ProgressDashboardModule {}