import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(email: string, name?: string, source = 'website') {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Email already subscribed');
      }
      return this.prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true, name: name || existing.name, source },
      });
    }

    return this.prisma.newsletterSubscriber.create({
      data: { email, name, source },
    });
  }

  async listAll() {
    return this.prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async unsubscribe(email: string) {
    const sub = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (!sub) throw new NotFoundException('Subscriber not found');

    return this.prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false },
    });
  }

  async remove(id: string) {
    const sub = await this.prisma.newsletterSubscriber.findUnique({
      where: { id },
    });
    if (!sub) throw new NotFoundException('Subscriber not found');
    return this.prisma.newsletterSubscriber.delete({ where: { id } });
  }

  async count() {
    const [total, active] = await Promise.all([
      this.prisma.newsletterSubscriber.count(),
      this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);
    return { total, active };
  }
}