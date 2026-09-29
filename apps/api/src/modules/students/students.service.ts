import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async listAll(params: { search?: string; role?: string; skip?: number; take?: number }) {
    const { search, role, skip = 0, take = 50 } = params;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items: users, total, skip, take };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        lastStreakNotified: true,
        enrollments: {
          include: { course: true },
          orderBy: { enrolledAt: 'desc' },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const [attemptCount, certificateCount, doubtCount, bookmarkCount] =
      await Promise.all([
        this.prisma.attempt.count({ where: { userId: id } }),
        this.prisma.certificate.count({ where: { userId: id } }),
        this.prisma.doubt.count({ where: { userId: id } }),
        this.prisma.bookmark.count({ where: { userId: id } }),
      ]);

    return {
      ...user,
      stats: {
        attempts: attemptCount,
        certificates: certificateCount,
        doubts: doubtCount,
        bookmarks: bookmarkCount,
      },
    };
  }

  async updateRole(id: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: { id: true, email: true, role: true },
    });
  }

  async toggleActive(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    // Note: user table doesn't have isActive — returning as-is for now
    return { success: true };
  }

  async stats() {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, students, admins, recent30, recent7] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPERADMIN'] } } }),
      this.prisma.user.count({ where: { createdAt: { gte: last30 } } }),
      this.prisma.user.count({ where: { createdAt: { gte: last7 } } }),
    ]);

    return { total, students, admins, last30Days: recent30, last7Days: recent7 };
  }
}