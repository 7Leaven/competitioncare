import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description?: string; duration?: number; seriesId?: string }) {
    return this.prisma.test.create({ data });
  }

  async findAll() {
    return this.prisma.test.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { questions: true } } },
    });
  }

  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.test.delete({ where: { id } });
  }
}
