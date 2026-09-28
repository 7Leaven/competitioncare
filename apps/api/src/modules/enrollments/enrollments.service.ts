import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
@Injectable()
export class EnrollmentsService {
   constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}
  async enroll(userId: string, courseId: string) {
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException('Already enrolled');

    const enrollment = await this.prisma.enrollment.create({
      data: { userId, courseId },
      include: { course: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true },
    });
    if (user) {
      this.mail
        .sendEnrollmentConfirmed(user.email, user.fullName, enrollment.course.title)
        .catch(() => {});
    }

    return enrollment;
  }

  async myCourses(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async check(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return { enrolled: !!enrollment, enrollment };
  }
}
