import {
  Body, Controller, Delete, Get, Param, Post, UseGuards,
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
    @Body() body: { title: string; content?: string; videoUrl?: string; order?: number },
  ) {
    return this.lessonsService.create(
      moduleId,
      body.title,
      body.content,
      body.videoUrl,
      body.order ?? 0,
    );
  }

  @Get('lessons/:id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
