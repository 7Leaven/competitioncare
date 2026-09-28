import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  private generateCertNumber() {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CC-${year}-${rand}`;
  }

  async issueForCourse(userId: string, courseId: string) {
    // Check if already issued
    const existing = await this.prisma.certificate.findFirst({
      where: { userId, courseId },
    });
    if (existing) return existing;

    // Check if all lessons are complete
    const modules = await this.prisma.module.findMany({
      where: { courseId },
      include: { lessons: true },
    });
    const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (lessonIds.length === 0) {
      throw new BadRequestException('Course has no lessons');
    }

    const completed = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: lessonIds },
        completed: true,
      },
    });

    if (completed < lessonIds.length) {
      throw new BadRequestException(
        `Complete all lessons first (${completed}/${lessonIds.length} done)`,
      );
    }

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.certificate.create({
      data: {
        userId,
        courseId,
        title: `Certificate of Completion — ${course.title}`,
        certNumber: this.generateCertNumber(),
      },
    });
  }

  async issueForTest(userId: string, testId: string, attemptId: string) {
    const existing = await this.prisma.certificate.findFirst({
      where: { userId, testId },
    });
    if (existing) return existing;

    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { test: true },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.userId !== userId) throw new BadRequestException('Not your attempt');
    if (!attempt.submittedAt) throw new BadRequestException('Test not submitted');

    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new NotFoundException('Test not found');

    return this.prisma.certificate.create({
      data: {
        userId,
        testId,
        title: `Certificate of Achievement — ${test.title}`,
        certNumber: this.generateCertNumber(),
      },
    });
  }

  async listMine(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert || cert.userId !== userId) {
      throw new NotFoundException('Certificate not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, email: true },
    });

    return { certificate: cert, user };
  }

  async findByNumber(certNumber: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { certNumber },
    });
    if (!cert) throw new NotFoundException('Certificate not found');

    const user = await this.prisma.user.findUnique({
      where: { id: cert.userId },
      select: { fullName: true },
    });

    return { certificate: cert, user };
  }
}