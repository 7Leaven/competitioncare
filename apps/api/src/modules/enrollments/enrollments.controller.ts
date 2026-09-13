import {
  Body, Controller, Get, Param, Post, Req, UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  enroll(@Req() req: any, @Body() body: { courseId: string }) {
    return this.enrollmentsService.enroll(req.user.id, body.courseId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  myCourses(@Req() req: any) {
    return this.enrollmentsService.myCourses(req.user.id);
  }

  @Get('check/:courseId')
  @UseGuards(JwtAuthGuard)
  check(@Req() req: any, @Param('courseId') courseId: string) {
    return this.enrollmentsService.check(req.user.id, courseId);
  }
}
