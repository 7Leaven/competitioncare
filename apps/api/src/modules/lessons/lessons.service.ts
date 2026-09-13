import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(
    moduleId: string,
    title: string,
    content?: string,
    videoUrl?: string,
    order = 0,
  ) {
    return this.prisma.lesson.create({
      data: { moduleId, title, content, videoUrl, order },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lesson.delete({ where: { id } });
  }
}
