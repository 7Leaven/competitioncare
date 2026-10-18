import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

 async log(params: {
  userId?: string | null;   // ← was: userId: string
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
    try {
      return await this.prisma.activityLog.create({ data: params });
    } catch (err) {
      // Never crash the caller because logging failed
      console.error('Failed to write activity log', err);
      return null;
    }
  }

  async findAll(params: {
    userId?: string;
    action?: string;
    entity?: string;
    skip?: number;
    take?: number;
  }) {
    const { userId, action, entity, skip = 0, take = 50 } = params;
    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entity) where.entity = entity;

    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: { select: { id: true, email: true, fullName: true, role: true } },
        },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async actions() {
    const rows = await this.prisma.activityLog.findMany({
      distinct: ['action'],
      select: { action: true },
      orderBy: { action: 'asc' },
    });
    return rows.map((r) => r.action);
  }
}
