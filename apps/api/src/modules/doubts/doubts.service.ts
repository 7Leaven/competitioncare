import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DoubtsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, subject: string, question: string) {
    return this.prisma.doubt.create({
      data: { userId, subject, question },
    });
  }

  async listMine(userId: string) {
    return this.prisma.doubt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAll() {
    const doubts = await this.prisma.doubt.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const userIds = [...new Set(doubts.map((d) => d.userId))];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, email: true },
    });

    return doubts.map((d) => ({
      ...d,
      user: users.find((u) => u.id === d.userId),
    }));
  }

  async findOne(id: string, userId?: string) {
    const doubt = await this.prisma.doubt.findUnique({ where: { id } });
    if (!doubt) throw new NotFoundException('Doubt not found');
    if (userId && doubt.userId !== userId) {
      throw new NotFoundException('Doubt not found');
    }
    return doubt;
  }

  async answer(id: string, adminId: string, answer: string) {
    await this.findOne(id);
    return this.prisma.doubt.update({
      where: { id },
      data: {
        answer,
        answeredBy: adminId,
        answeredAt: new Date(),
        status: 'ANSWERED',
      },
    });
  }

  async reopen(id: string) {
    await this.findOne(id);
    return this.prisma.doubt.update({
      where: { id },
      data: { status: 'OPEN', answer: null, answeredBy: null, answeredAt: null },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.doubt.delete({ where: { id } });
  }
}