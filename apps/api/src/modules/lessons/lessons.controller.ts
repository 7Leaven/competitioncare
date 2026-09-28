import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('modules/:moduleId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(
    @Param('moduleId') moduleId: string,
    @Body() body: {
      title: string;
      content?: string;
      videoUrl?: string;
      notesUrl?: string;
      notesLabel?: string;
      order?: number;
    },
  ) {
    return this.lessonsService.create(
      moduleId,
      body.title,
      body.content,
      body.videoUrl,
      body.order ?? 0,
      body.notesUrl,
      body.notesLabel,
    );
  }

  @Get('lessons/:id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.lessonsService.update(id, body);
  }

  @Post('lessons/:id/complete')
  @UseGuards(JwtAuthGuard)
  markComplete(@Req() req: any, @Param('id') id: string) {
    return this.lessonsService.markComplete(req.user.id, id);
  }

  @Get('courses/:courseId/progress')
  @UseGuards(JwtAuthGuard)
  getProgress(@Req() req: any, @Param('courseId') courseId: string) {
    return this.lessonsService.getCourseProgress(req.user.id, courseId);
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}