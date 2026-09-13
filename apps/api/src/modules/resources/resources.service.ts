import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    slug: string;
    description?: string;
    category?: string;
    fileUrl: string;
    fileSize?: number;
    fileType?: string;
  }) {
    return this.prisma.resource.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        category: data.category ?? 'General',
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
      },
    });
  }

  async findAll(params: { category?: string; skip?: number; take?: number }) {
    const { category, skip = 0, take = 20 } = params;
    const where = category ? { category } : {};
    const [items, total] = await Promise.all([
      this.prisma.resource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.resource.count({ where }),
    ]);
    return { items, total, skip, take };
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.resource.findUnique({ where: { slug } });
    if (!item) throw new NotFoundException('Resource not found');
    return item;
  }

  async findById(id: string) {
    const item = await this.prisma.resource.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Resource not found');
    return item;
  }

  async incrementDownload(id: string) {
    return this.prisma.resource.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    return this.prisma.resource.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.resource.delete({ where: { id } });
  }
}
