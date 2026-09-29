import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('summary')
  summary() {
    return this.service.summary();
  }

  @Get('signups')
  signups(@Query('days') days?: string) {
    return this.service.signups(days ? parseInt(days, 10) : 30);
  }

  @Get('top-courses')
  topCourses(@Query('limit') limit?: string) {
    return this.service.topCourses(limit ? parseInt(limit, 10) : 5);
  }
}

