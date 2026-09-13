import { Module } from '@nestjs/common';
import { CurrentAffairsService } from './current-affairs.service';
import { CurrentAffairsController } from './current-affairs.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CurrentAffairsController],
  providers: [CurrentAffairsService, PrismaService],
})
export class CurrentAffairsModule {}
