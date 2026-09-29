import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

type BulkQuestion = {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  marks?: number;
  order?: number;
};

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

  async bulkCreate(testId: string, questions: BulkQuestion[]) {
    // Step 1: Verify test exists
    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new NotFoundException('Test not found');

    // Step 2: Find the highest order value
    const last = await this.prisma.question.findFirst({
      where: { testId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const startOrder = (last?.order ?? -1) + 1;

    // Step 3: Build the data array with sequential orders
    const data = questions.map((q, i) => ({
      testId,
      text: q.text,
      options: q.options as any,
      correctOption: q.correctOption,
      explanation: q.explanation,
      marks: q.marks ?? 1,
      order: startOrder + i,
    }));

    // Step 4: Insert all in one query
    const result = await this.prisma.question.createMany({ data });

    // Step 5: Recalculate total marks
    const allQuestions = await this.prisma.question.findMany({
      where: { testId },
      select: { marks: true },
    });
    const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await this.prisma.test.update({
      where: { id: testId },
      data: { totalMarks },
    });

    // Step 6: Return summary
    return {
      success: true,
      inserted: result.count,
      totalMarks,
    };
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

    await this.prisma.question.delete({ where: { id } });

    // Recalculate total marks on the test
    const allQuestions = await this.prisma.question.findMany({
      where: { testId: q.testId },
      select: { marks: true },
    });
    const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await this.prisma.test.update({
      where: { id: q.testId },
      data: { totalMarks },
    });

    return { success: true };
  }
}