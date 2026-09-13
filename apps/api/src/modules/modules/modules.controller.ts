import {
  Body, Controller, Delete, Get, Param, Post, UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post('courses/:courseId/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(
    @Param('courseId') courseId: string,
    @Body() body: { title: string; order?: number },
  ) {
    return this.modulesService.create(courseId, body.title, body.order ?? 0);
  }

  @Get('courses/:courseId/modules')
  findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourse(courseId);
  }

  @Delete('modules/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
