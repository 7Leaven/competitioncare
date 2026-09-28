import { Module } from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { DoubtsController } from './doubts.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DoubtsController],
  providers: [DoubtsService, PrismaService],
})
export class DoubtsModule {}