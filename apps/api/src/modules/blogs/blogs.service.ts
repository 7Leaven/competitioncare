import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category?: string;
    tags?: string[];
    publishedAt?: string;
  }) {
    return this.prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
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
      this.prisma.blog.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          tags: true,
          publishedAt: true,
        },
      }),
      this.prisma.blog.count({ where }),
    ]);
    return { items, total, skip, take };
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.blog.findUnique({ where: { slug } });
    if (!item) throw new NotFoundException('Blog post not found');
    return item;
  }

  async findById(id: string) {
    const item = await this.prisma.blog.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Blog post not found');
    return item;
  }

  async update(id: string, data: any) {
    await this.findById(id);
    const updateData: any = { ...data };
    if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
    return this.prisma.blog.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.blog.delete({ where: { id } });
  }
}
