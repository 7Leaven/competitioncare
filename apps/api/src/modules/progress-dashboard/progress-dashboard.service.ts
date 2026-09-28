import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProgressDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [enrollments, attempts, lessonProgress, certificates, bookmarks] =
      await Promise.all([
        this.prisma.enrollment.findMany({
          where: { userId },
          include: { course: true },
        }),
        this.prisma.attempt.findMany({
          where: { userId },
          include: { test: true },
          orderBy: { startedAt: 'desc' },
        }),
        this.prisma.lessonProgress.findMany({
          where: { userId, completed: true },
        }),
        this.prisma.certificate.count({ where: { userId } }),
        this.prisma.bookmark.count({ where: { userId } }),
      ]);

    const activityDates = new Set<string>();
    attempts.forEach((a) => {
      activityDates.add(new Date(a.startedAt).toISOString().split('T')[0]);
      if (a.submittedAt) {
        activityDates.add(new Date(a.submittedAt).toISOString().split('T')[0]);
      }
    });
    lessonProgress.forEach((lp) => {
      if (lp.completedAt) {
        activityDates.add(new Date(lp.completedAt).toISOString().split('T')[0]);
      }
    });

    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      if (activityDates.has(key)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    const sortedDates = Array.from(activityDates).sort();
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      if (prevDate) {
        const diff =
          (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      prevDate = date;
    }

    const courseProgress = await Promise.all(
      enrollments.map(async (e) => {
        const modules = await this.prisma.module.findMany({
          where: { courseId: e.courseId },
          include: { lessons: true },
        });
        const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
        const totalLessons = lessonIds.length;
        const completed = await this.prisma.lessonProgress.count({
          where: {
            userId,
            lessonId: { in: lessonIds },
            completed: true,
          },
        });
        const percent =
          totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
        return {
          courseId: e.courseId,
          courseTitle: e.course.title,
          totalLessons,
          completedLessons: completed,
          percent,
        };
      }),
    );

    const completedAttempts = attempts.filter((a) => a.submittedAt);
    const avgScore =
      completedAttempts.length > 0
        ? Math.round(
            (completedAttempts.reduce((s, a) => s + (a.score || 0), 0) /
              completedAttempts.length) *
              100,
          ) / 100
        : 0;

    const milestones = [
      { id: 'first-course', label: 'Enrolled in first course', achieved: enrollments.length >= 1 },
      { id: 'first-test', label: 'Completed first test', achieved: completedAttempts.length >= 1 },
      { id: 'first-lesson', label: 'Completed first lesson', achieved: lessonProgress.length >= 1 },
      { id: 'five-lessons', label: 'Completed 5 lessons', achieved: lessonProgress.length >= 5 },
      { id: 'ten-lessons', label: 'Completed 10 lessons', achieved: lessonProgress.length >= 10 },
      { id: 'five-tests', label: 'Completed 5 tests', achieved: completedAttempts.length >= 5 },
      { id: 'first-certificate', label: 'Earned first certificate', achieved: certificates >= 1 },
      { id: 'streak-7', label: 'Maintained 7-day streak', achieved: longestStreak >= 7 },
      { id: 'streak-30', label: 'Maintained 30-day streak', achieved: longestStreak >= 30 },
      { id: 'first-bookmark', label: 'Bookmarked first item', achieved: bookmarks >= 1 },
    ];

    return {
      summary: {
        enrolledCourses: enrollments.length,
        completedTests: completedAttempts.length,
        totalTests: attempts.length,
        completedLessons: lessonProgress.length,
        certificates,
        bookmarks,
        currentStreak,
        longestStreak,
        avgScore,
      },
      courseProgress,
      milestones,
    };
  }
}