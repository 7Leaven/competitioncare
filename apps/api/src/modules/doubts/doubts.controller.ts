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
import { DoubtsService } from './doubts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('doubts')
export class DoubtsController {
  constructor(private readonly service: DoubtsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: any,
    @Body() body: { subject: string; question: string },
  ) {
    return this.service.create(req.user.id, body.subject, body.question);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  listMine(@Req() req: any) {
    return this.service.listMine(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  listAll() {
    return this.service.listAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id/answer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  answer(@Req() req: any, @Param('id') id: string, @Body() body: { answer: string }) {
    return this.service.answer(id, req.user.id, body.answer);
  }

  @Patch(':id/reopen')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  reopen(@Param('id') id: string) {
    return this.service.reopen(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(id, req.user.id);
  }
}