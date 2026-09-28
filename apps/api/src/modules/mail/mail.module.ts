import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { PrismaService } from '../../database/prisma.service';

@Global()
@Module({
  controllers: [MailController],
  providers: [MailService, PrismaService],
  exports: [MailService],
})
export class MailModule {}