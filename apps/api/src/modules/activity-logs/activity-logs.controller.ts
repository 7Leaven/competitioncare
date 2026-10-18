import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class ActivityLogsController {
  constructor(private readonly service: ActivityLogsService) {}

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.service.findAll({
      userId,
      action,
      entity,
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 50,
    });
  }

  @Get('actions')
  actions() {
    return this.service.actions();
  }
}