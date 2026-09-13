import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    testId: string;
    text: string;
    options: any;
    correctOption: number;
    explanation?: string;
    marks?: number;
    order?: number;
  }) {
    return this.prisma.question.create({ data });
  }

  async findByTest(testId: string) {
    return this.prisma.question.findMany({
      where: { testId },
      orderBy: { order: 'asc' },
    });
  }

  async remove(id: string) {
    const q = await this.prisma.question.findUnique({ where: { id } });
    if (!q) throw new NotFoundException('Question not found');
    return this.prisma.question.delete({ where: { id } });
  }
}
