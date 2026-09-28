import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async create(
    moduleId: string,
    title: string,
    content?: string,
    videoUrl?: string,
    order = 0,
    notesUrl?: string,
    notesLabel?: string,
  ) {
    return this.prisma.lesson.create({
      data: { moduleId, title, content, videoUrl, order, notesUrl, notesLabel },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            course: true,
            lessons: { orderBy: { order: 'asc' } },
          },
        },
      },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async markComplete(userId: string, lessonId: string) {
    await this.findOne(lessonId);
    const result = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });

    this.checkStreak(userId).catch(() => {});

    return result;
  }

  private async checkStreak(userId: string) {
    const attempts = await this.prisma.attempt.findMany({
      where: { userId },
      select: { startedAt: true, submittedAt: true },
    });
    const progress = await this.prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      select: { completedAt: true },
    });

    const dates = new Set<string>();
    attempts.forEach((a) => {
      dates.add(new Date(a.startedAt).toISOString().split('T')[0]);
      if (a.submittedAt) {
        dates.add(new Date(a.submittedAt).toISOString().split('T')[0]);
      }
    });
    progress.forEach((p) => {
      if (p.completedAt) {
        dates.add(new Date(p.completedAt).toISOString().split('T')[0]);
      }
    });

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      if (dates.has(key)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const milestones = [7, 30, 100];
    if (!milestones.includes(streak)) return;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true, lastStreakNotified: true },
    });
    if (!user) return;

    if (streak > user.lastStreakNotified) {
      await this.mail.sendStreakMilestone(user.email, user.fullName, streak);
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastStreakNotified: streak },
      });
    }
  }

  async getCourseProgress(userId: string, courseId: string) {
    const modules = await this.prisma.module.findMany({
      where: { courseId },
      include: { lessons: true },
    });
    const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
    const totalLessons = lessonIds.length;
    if (totalLessons === 0) {
      return { completedLessonIds: [], totalLessons: 0, completedCount: 0, percent: 0 };
    }
    const completed = await this.prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessonIds }, completed: true },
    });
    const completedCount = completed.length;
    const percent = Math.round((completedCount / totalLessons) * 100);
    return {
      completedLessonIds: completed.map((c) => c.lessonId),
      totalLessons,
      completedCount,
      percent,
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lesson.delete({ where: { id } });
  }
}