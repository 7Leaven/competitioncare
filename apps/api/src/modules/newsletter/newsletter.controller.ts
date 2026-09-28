import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { NewsletterService } from './newsletter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}

  @Post('subscribe')
  subscribe(@Body() body: { email: string; name?: string; source?: string }) {
    return this.service.subscribe(body.email, body.name, body.source);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  listAll() {
    return this.service.listAll();
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  count() {
    return this.service.count();
  }

  @Post('unsubscribe')
  unsubscribe(@Body() body: { email: string }) {
    return this.service.unsubscribe(body.email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}