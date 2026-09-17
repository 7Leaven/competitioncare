import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(
    moduleId: string,
    title: string,
    content?: string,
    videoUrl?: string,
    order = 0,
  ) {
    return this.prisma.lesson.create({
      data: { moduleId, title, content, videoUrl, order },
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

  async markComplete(userId: string, lessonId: string) {
    await this.findOne(lessonId);
    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });
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
      where: {
        userId,
        lessonId: { in: lessonIds },
        completed: true,
      },
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
