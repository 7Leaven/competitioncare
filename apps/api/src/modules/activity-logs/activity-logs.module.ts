import { Global, Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService, PrismaService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}