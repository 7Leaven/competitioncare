import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { BroadcastService } from './broadcast.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/broadcast')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class BroadcastController {
  constructor(private readonly service: BroadcastService) {}

  @Post()
  send(
    @Body()
    body: {
      subject: string;
      html: string;
      audience: 'ALL' | 'STUDENTS' | 'INSTRUCTORS' | 'ADMINS';
    },
  ) {
    return this.service.send(body);
  }
}