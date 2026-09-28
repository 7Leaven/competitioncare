import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly service: BookmarksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Req() req: any) {
    return this.service.list(req.user.id);
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  check(
    @Req() req: any,
    @Query('itemType') itemType: string,
    @Query('itemId') itemId: string,
  ) {
    return this.service.check(req.user.id, itemType, itemId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  add(
    @Req() req: any,
    @Body() body: { itemType: string; itemId: string },
  ) {
    return this.service.add(req.user.id, body.itemType, body.itemId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(
    @Req() req: any,
    @Query('itemType') itemType: string,
    @Query('itemId') itemId: string,
  ) {
    return this.service.remove(req.user.id, itemType, itemId);
  }
}