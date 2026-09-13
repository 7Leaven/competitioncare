import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, title: string, order = 0) {
    return this.prisma.module.create({
      data: { courseId, title, order },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
  }

  async remove(id: string) {
    const mod = await this.prisma.module.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');
    return this.prisma.module.delete({ where: { id } });
  }
}
