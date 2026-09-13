import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async start(userId: string, testId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!test) throw new NotFoundException('Test not found');

    const attempt = await this.prisma.attempt.create({
      data: { userId, testId },
    });

    return {
      attemptId: attempt.id,
      test: {
        id: test.id,
        title: test.title,
        duration: test.duration,
      },
      questions: test.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        marks: q.marks,
        order: q.order,
      })),
    };
  }

  async submit(
    userId: string,
    attemptId: string,
    answers: { questionId: string; selectedOption: number }[],
  ) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.userId !== userId) throw new BadRequestException('Not your attempt');
    if (attempt.submittedAt) throw new BadRequestException('Already submitted');

    const questions = await this.prisma.question.findMany({
      where: { testId: attempt.testId },
    });

    let score = 0;
    const createdAnswers = [];

    for (const q of questions) {
      const submitted = answers.find((a) => a.questionId === q.id);
      const selected = submitted?.selectedOption ?? -1;
      const isCorrect = selected === q.correctOption;
      if (isCorrect) score += q.marks;
      createdAnswers.push({
        attemptId,
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
      });
    }

    await this.prisma.answer.createMany({ data: createdAnswers });

    const updated = await this.prisma.attempt.update({
      where: { id: attemptId },
      data: { submittedAt: new Date(), score },
      include: {
        answers: {
          include: { question: true },
        },
        test: true,
      },
    });

    return updated;
  }

  async myAttempts(userId: string) {
    return this.prisma.attempt.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id },
      include: {
        answers: { include: { question: true } },
        test: true,
      },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.userId !== userId) throw new BadRequestException('Not your attempt');
    return attempt;
  }
}
