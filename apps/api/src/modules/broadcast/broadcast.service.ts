import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';

type Audience = 'ALL' | 'STUDENTS' | 'INSTRUCTORS' | 'ADMINS';

@Injectable()
export class BroadcastService {
  private readonly logger = new Logger(BroadcastService.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async send(params: { subject: string; html: string; audience: Audience }) {
    const recipients = await this.getRecipients(params.audience);

    if (recipients.length === 0) {
      return { success: true, sent: 0, failed: 0, total: 0 };
    }

    const BATCH_SIZE = 50;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map((r) =>
          this.mail.sendBroadcastEmail(r.email, params.subject, params.html),
        ),
      );
      results.forEach((r) => (r.success ? sent++ : failed++));
      this.logger.log(`Batch ${i / BATCH_SIZE + 1}: sent=${sent} failed=${failed}`);
    }

    return { success: true, sent, failed, total: recipients.length };
  }

  private async getRecipients(audience: Audience) {
    const where: any = {};
    if (audience === 'STUDENTS') where.role = 'STUDENT';
    else if (audience === 'INSTRUCTORS') where.role = 'INSTRUCTOR';
    else if (audience === 'ADMINS') where.role = { in: ['ADMIN', 'SUPERADMIN'] };

    return this.prisma.user.findMany({
      where,
      select: { email: true, fullName: true },
    });
  }
}