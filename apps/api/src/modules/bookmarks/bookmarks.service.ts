import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, itemType: string, itemId: string) {
    return this.prisma.bookmark.upsert({
      where: { userId_itemType_itemId: { userId, itemType, itemId } },
      create: { userId, itemType, itemId },
      update: {},
    });
  }

  async remove(userId: string, itemType: string, itemId: string) {
    await this.prisma.bookmark.deleteMany({
      where: { userId, itemType, itemId },
    });
    return { success: true };
  }

  async check(userId: string, itemType: string, itemId: string) {
    const found = await this.prisma.bookmark.findUnique({
      where: { userId_itemType_itemId: { userId, itemType, itemId } },
    });
    return { bookmarked: !!found };
  }

  async list(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const hydrated = await Promise.all(
      bookmarks.map(async (b) => {
        let item: any = null;
        try {
          if (b.itemType === 'COURSE') {
            item = await this.prisma.course.findUnique({
              where: { id: b.itemId },
              select: { id: true, title: true, description: true, price: true },
            });
          } else if (b.itemType === 'TEST') {
            item = await this.prisma.test.findUnique({
              where: { id: b.itemId },
              select: { id: true, title: true, description: true, duration: true },
            });
          } else if (b.itemType === 'CURRENT_AFFAIR') {
            item = await this.prisma.currentAffair.findUnique({
              where: { id: b.itemId },
              select: { id: true, title: true, slug: true, summary: true, category: true },
            });
          } else if (b.itemType === 'BLOG') {
            item = await this.prisma.blog.findUnique({
              where: { id: b.itemId },
              select: { id: true, title: true, slug: true, excerpt: true, category: true },
            });
          } else if (b.itemType === 'RESOURCE') {
            item = await this.prisma.resource.findUnique({
              where: { id: b.itemId },
              select: { id: true, title: true, fileUrl: true, category: true },
            });
          }
        } catch {
          item = null;
        }

        return {
          id: b.id,
          itemType: b.itemType,
          itemId: b.itemId,
          createdAt: b.createdAt,
          item,
        };
      }),
    );

    return {
      items: hydrated.filter((h) => h.item !== null),
      total: hydrated.filter((h) => h.item !== null).length,
    };
  }
}