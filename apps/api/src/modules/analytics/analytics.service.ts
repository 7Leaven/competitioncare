import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalRevenue, totalEnrollments, totalAttempts, last30DaysUsers] =
  await Promise.all([
    this.prisma.user.count(),
    0, // TODO: add when Payment model exists
    this.prisma.enrollment.count(),
    this.prisma.attempt.count(),
    this.prisma.user.count({ where: { createdAt: { gte: last30 } } }),
  ]);

    return {
      totalUsers,
      totalRevenue,
      totalEnrollments,
      totalAttempts,
      last30DaysUsers,
    };
  }

  async signups(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });

    const map = new Map<string, number>();
    users.forEach(u => {
      const date = u.createdAt.toISOString().split('T')[0];
      map.set(date, (map.get(date) || 0) + 1);
    });

    const result: { date: string; count: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({ date: key, count: map.get(key) || 0 });
    }
    return result.reverse();
  }

  async topCourses(limit = 5) {
    const courses = await this.prisma.course.findMany({
      take: limit,
      orderBy: { enrollments: { _count: 'desc' } },
      select: {
        id: true,
        title: true,
        _count: { select: { enrollments: true } },
      },
    });
    return courses.map(c => ({
      courseTitle: c.title,
      enrollments: c._count.enrollments,
    }));
  }
}