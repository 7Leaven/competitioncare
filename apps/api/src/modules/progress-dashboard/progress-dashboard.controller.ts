import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProgressDashboardService } from './progress-dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('progress-dashboard')
export class ProgressDashboardController {
  constructor(private readonly service: ProgressDashboardService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return this.service.getDashboard(req.user.id);
  }
}