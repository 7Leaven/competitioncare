import {
  Body, Controller, Delete, Get, Param, Post, UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('tests/:testId/questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(
    @Param('testId') testId: string,
    @Body() body: {
      text: string;
      options: any;
      correctOption: number;
      explanation?: string;
      marks?: number;
      order?: number;
    },
  ) {
    return this.questionsService.create({ testId, ...body });
  }

  @Get('tests/:testId/questions')
  findByTest(@Param('testId') testId: string) {
    return this.questionsService.findByTest(testId);
  }

  @Delete('questions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
