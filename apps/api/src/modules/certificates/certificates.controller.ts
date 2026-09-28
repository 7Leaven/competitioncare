import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  listMine(@Req() req: any) {
    return this.service.listMine(req.user.id);
  }

  @Get('verify/:certNumber')
  verify(@Param('certNumber') certNumber: string) {
    return this.service.findByNumber(certNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }

  @Post('course/:courseId')
  @UseGuards(JwtAuthGuard)
  issueCourse(@Req() req: any, @Param('courseId') courseId: string) {
    return this.service.issueForCourse(req.user.id, courseId);
  }

  @Post('test/:testId')
  @UseGuards(JwtAuthGuard)
  issueTest(
    @Req() req: any,
    @Param('testId') testId: string,
    @Body() body: { attemptId: string },
  ) {
    return this.service.issueForTest(req.user.id, testId, body.attemptId);
  }
}