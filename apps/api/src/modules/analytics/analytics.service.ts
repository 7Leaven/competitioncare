import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserAnalytics(userId: string) {
    const attempts = await this.prisma.attempt.findMany({
      where: { userId },
      include: {
        test: { select: { id: true, title: true } },
        answers: {
          include: {
            question: { select: { marks: true } },
          },
        },
      },
      orderBy: { startedAt: 'asc' },
    });

    const completed = attempts.filter((a) => a.submittedAt);

    const totalAttempts = attempts.length;
    const completedAttempts = completed.length;
    const inProgress = totalAttempts - completedAttempts;

    const scores = completed.map((a) => a.score || 0);
    const avgScore =
      scores.length > 0
        ? Math.round((scores.reduce((s, x) => s + x, 0) / scores.length) * 100) / 100
        : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const totalScore = scores.reduce((s, x) => s + x, 0);

    // Accuracy: correct / total answered
    let totalAnswers = 0;
    let correctAnswers = 0;
    completed.forEach((a) => {
      a.answers.forEach((ans) => {
        totalAnswers += 1;
        if (ans.isCorrect) correctAnswers += 1;
      });
    });
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Score trend (chronological)
    const scoreTrend = completed.map((a) => ({
      attemptId: a.id,
      testTitle: a.test?.title || 'Test',
      score: a.score || 0,
      date: a.submittedAt,
    }));

    // Per-test aggregation
    const byTest: Record<string, { testId: string; testTitle: string; attempts: number; bestScore: number; avgScore: number; scores: number[] }> = {};
    completed.forEach((a) => {
      const tid = a.test?.id || 'unknown';
      if (!byTest[tid]) {
        byTest[tid] = {
          testId: tid,
          testTitle: a.test?.title || 'Test',
          attempts: 0,
          bestScore: 0,
          avgScore: 0,
          scores: [],
        };
      }
      byTest[tid].attempts += 1;
      byTest[tid].scores.push(a.score || 0);
      if ((a.score || 0) > byTest[tid].bestScore) byTest[tid].bestScore = a.score || 0;
    });
    Object.values(byTest).forEach((t) => {
      t.avgScore = Math.round((t.scores.reduce((s, x) => s + x, 0) / t.scores.length) * 100) / 100;
    });

    // Recent attempts (last 5)
    const recent = attempts
      .slice()
      .reverse()
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        testId: a.test?.id || '',
        testTitle: a.test?.title || 'Test',
        score: a.score,
        submittedAt: a.submittedAt,
        startedAt: a.startedAt,
      }));

    return {
      summary: {
        totalAttempts,
        completedAttempts,
        inProgress,
        avgScore,
        bestScore,
        totalScore,
        accuracy,
        correctAnswers,
        totalAnswers,
      },
      scoreTrend,
      byTest: Object.values(byTest),
      recent,
    };
  }
}