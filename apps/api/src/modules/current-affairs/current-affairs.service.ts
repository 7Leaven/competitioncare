import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CurrentAffairsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    slug: string;
    summary?: string;
    content: string;
    category?: string;
    tags?: string[];
    publishedAt?: string;
  }) {
    return this.prisma.currentAffair.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        category: data.category ?? 'General',
        tags: data.tags ?? [],
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      },
    });
  }

  async findAll(params: { category?: string; skip?: number; take?: number }) {
    const { category, skip = 0, take = 20 } = params;
    const where = category ? { category } : {};
    const [items, total] = await Promise.all([
      this.prisma.currentAffair.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          category: true,
          tags: true,
          publishedAt: true,
        },
      }),
      this.prisma.currentAffair.count({ where }),
    ]);
    return { items, total, skip, take };
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.currentAffair.findUnique({ where: { slug } });
    if (!item) throw new NotFoundException('Current affair not found');
    return item;
  }

  async findById(id: string) {
    const item = await this.prisma.currentAffair.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Current affair not found');
    return item;
  }

  async update(id: string, data: any) {
    await this.findById(id);
    const updateData: any = { ...data };
    if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
    return this.prisma.currentAffair.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.currentAffair.delete({ where: { id } });
  }
}
