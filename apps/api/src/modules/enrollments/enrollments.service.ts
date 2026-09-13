import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(userId: string, courseId: string) {
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException('Already enrolled');

    return this.prisma.enrollment.create({
      data: { userId, courseId },
      include: { course: true },
    });
  }

  async myCourses(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async check(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return { enrolled: !!enrollment, enrollment };
  }
}
