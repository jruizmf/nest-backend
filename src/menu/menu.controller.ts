import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.menuService.findAll(query);
  }

  @Get(':menuId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('menuId', ParseUUIDPipe) menuId: string) {
    return this.menuService.findOne(menuId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateMenuDto) {
    const data = await this.menuService.create(dto);
    return { data, message: 'Menu added succesfully' };
  }

  @Put(':menuId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menuService.update(menuId, dto);
  }

  @Delete(':menuId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('menuId', ParseUUIDPipe) menuId: string) {
    await this.menuService.remove(menuId);
    return { message: `Menu deleted ${menuId}` };
  }
}
