import {
  Body, Controller, Get, Param, Post, Req, UseGuards,
} from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('tests/:testId/attempts')
  @UseGuards(JwtAuthGuard)
  start(@Req() req: any, @Param('testId') testId: string) {
    return this.attemptsService.start(req.user.id, testId);
  }

  @Post('attempts/:attemptId/submit')
  @UseGuards(JwtAuthGuard)
  submit(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() body: { answers: { questionId: string; selectedOption: number }[] },
  ) {
    return this.attemptsService.submit(req.user.id, attemptId, body.answers || []);
  }

  @Get('attempts/me')
  @UseGuards(JwtAuthGuard)
  myAttempts(@Req() req: any) {
    return this.attemptsService.myAttempts(req.user.id);
  }

  @Get('attempts/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.attemptsService.findOne(req.user.id, id);
  }
}
