import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string) {
    const query = q.trim();
    if (!query || query.length < 2) {
      return {
        courses: [],
        tests: [],
        currentAffairs: [],
        blogs: [],
        resources: [],
        total: 0,
      };
    }

    const [courses, tests, currentAffairs, blogs, resources] = await Promise.all([
      this.prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, title: true, slug: true, description: true, price: true },
      }),
      this.prisma.test.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, title: true, description: true, duration: true },
      }),
      this.prisma.currentAffair.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, title: true, slug: true, summary: true, category: true },
      }),
      this.prisma.blog.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, title: true, slug: true, excerpt: true, category: true },
      }),
      this.prisma.resource.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, title: true, slug: true, description: true, category: true },
      }),
    ]);

    const total =
      courses.length +
      tests.length +
      currentAffairs.length +
      blogs.length +
      resources.length;

    return { courses, tests, currentAffairs, blogs, resources, total, query };
  }
}