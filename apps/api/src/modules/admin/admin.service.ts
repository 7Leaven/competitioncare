import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, courses, tests, enrollments, attempts, questions] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.course.count(),
        this.prisma.test.count(),
        this.prisma.enrollment.count(),
        this.prisma.attempt.count(),
        this.prisma.question.count(),
      ]);

    return { users, courses, tests, enrollments, attempts, questions };
  }
}