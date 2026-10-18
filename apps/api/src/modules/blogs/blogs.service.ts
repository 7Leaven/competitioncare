import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private logs: ActivityLogsService,
  ) {}

  async create(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category?: string;
    tags?: string[];
    publishedAt?: string;
    status?: string;
    scheduledAt?: string;
  }) {
    const blog = await this.prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category ?? 'General',
        tags: data.tags ?? [],
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        status: data.status ?? 'DRAFT',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    });

    await this.logs.log({
      userId: null,
      action: 'BLOG_CREATED',
      entity: 'Blog',
      entityId: blog.id,
      metadata: { title: blog.title, slug: blog.slug, status: blog.status },
    });

    return blog;
  }

  async findAll(params: { category?: string; skip?: number; take?: number }) {
    const { category, skip = 0, take = 20 } = params;
    const where: any = { status: 'PUBLISHED' };
    if (category) where.category = category;

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
    const item = await this.prisma.blog.findFirst({
      where: { slug, status: 'PUBLISHED' },
    });
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

    const blog = await this.prisma.blog.update({
      where: { id },
      data: updateData,
    });

    await this.logs.log({
      userId: null,
      action: 'BLOG_UPDATED',
      entity: 'Blog',
      entityId: id,
      metadata: { title: blog.title, changed: Object.keys(data) },
    });

    return blog;
  }

  async remove(id: string) {
    const blog = await this.findById(id);
    const deleted = await this.prisma.blog.delete({ where: { id } });

    await this.logs.log({
      userId: null,
      action: 'BLOG_DELETED',
      entity: 'Blog',
      entityId: id,
      metadata: { title: blog.title, slug: blog.slug },
    });

    return deleted;
  }

  async findAllForAdmin() {
    return this.prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async publish(id: string) {
    const blog = await this.prisma.blog.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });

    await this.logs.log({
      userId: null,
      action: 'BLOG_PUBLISHED',
      entity: 'Blog',
      entityId: id,
      metadata: { title: blog.title, slug: blog.slug },
    });

    return blog;
  }

  async unpublish(id: string) {
    const blog = await this.prisma.blog.update({
      where: { id },
      data: { status: 'DRAFT' },
    });

    await this.logs.log({
      userId: null,
      action: 'BLOG_UNPUBLISHED',
      entity: 'Blog',
      entityId: id,
      metadata: { title: blog.title, slug: blog.slug },
    });

    return blog;
  }

  async schedule(id: string, scheduledAt: Date) {
    const blog = await this.prisma.blog.update({
      where: { id },
      data: { scheduledAt, status: 'DRAFT' },
    });

    await this.logs.log({
      userId: null,
      action: 'BLOG_SCHEDULED',
      entity: 'Blog',
      entityId: id,
      metadata: { title: blog.title, scheduledAt },
    });

    return blog;
  }

  async cancelSchedule(id: string) {
    const blog = await this.prisma.blog.update({
      where: { id },
      data: { scheduledAt: null },
    });

    await this.logs.log({
      userId: null,
      action: 'BLOG_SCHEDULE_CANCELLED',
      entity: 'Blog',
      entityId: id,
      metadata: { title: blog.title },
    });

    return blog;
  }

  async publishDueBlogs() {
    const now = new Date();
    const result = await this.prisma.blog.updateMany({
      where: {
        status: 'DRAFT',
        scheduledAt: { lte: now, not: null },
      },
      data: {
        status: 'PUBLISHED',
        publishedAt: now,
      },
    });

    if (result.count > 0) {
      await this.logs.log({
        userId: null,
        action: 'BLOGS_AUTO_PUBLISHED',
        entity: 'Blog',
        metadata: { count: result.count, publishedAt: now },
      });
    }

    return result.count;
  }
}