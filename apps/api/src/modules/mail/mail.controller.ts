import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from './mail.service';

@Controller('cron')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  private checkSecret(secret: string) {
    const expected = process.env.CRON_SECRET || 'change-me';
    if (secret !== expected) {
      throw new UnauthorizedException('Invalid cron secret');
    }
  }

  @Post('daily-current-affairs')
  async dailyCurrentAffairs(@Headers('x-cron-secret') secret: string) {
    this.checkSecret(secret);

    const since = new Date();
    since.setDate(since.getDate() - 1);

    const articles = await this.prisma.currentAffair.findMany({
      where: { publishedAt: { gte: since } },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: { title: true, summary: true, slug: true, category: true },
    });

    if (articles.length === 0) {
      this.logger.log('No current affairs from last 24h — skipping email');
      return { sent: 0, reason: 'no-articles' };
    }

    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true, name: true },
    });

    for (const sub of subscribers) {
      await this.mail
        .sendDailyCurrentAffairsDigest(sub.email, sub.name || 'there', articles)
        .catch(() => {});
    }

    return { sent: subscribers.length, articles: articles.length };
  }

  @Post('test-reminders')
  async testReminders(@Headers('x-cron-secret') secret: string) {
    this.checkSecret(secret);

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcoming = await this.prisma.test.findMany({
      where: {
        scheduledAt: { gte: now, lte: in24h },
      },
      select: { id: true, title: true, scheduledAt: true },
    });

    if (upcoming.length === 0) {
      return { sent: 0, reason: 'no-upcoming-tests' };
    }

    let totalSent = 0;

    for (const test of upcoming) {
      const attempted = await this.prisma.attempt.findMany({
        where: { testId: test.id },
        select: { userId: true },
        distinct: ['userId'],
      });
      const attemptedIds = new Set(attempted.map((a) => a.userId));

      const users = await this.prisma.user.findMany({
        where: {
          id: { notIn: Array.from(attemptedIds) },
          role: 'STUDENT',
        },
        select: { email: true, fullName: true },
      });

      for (const user of users) {
        await this.mail
          .sendTestReminder(
            user.email,
            user.fullName,
            test.title,
            test.id,
            test.scheduledAt!,
          )
          .catch(() => {});
        totalSent++;
      }
    }

    return { sent: totalSent, tests: upcoming.length };
  }
}