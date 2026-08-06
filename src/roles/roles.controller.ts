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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.rolesService.findAll(query);
  }

  @Get(':roleId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return this.rolesService.findOne(roleId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.rolesService.create(dto);
    return { data: role, message: 'Role added succesfully' };
  }

  @Put(':roleId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(roleId, dto);
  }

  @Delete(':roleId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('roleId', ParseUUIDPipe) roleId: string) {
    await this.rolesService.remove(roleId);
    return { message: `Role deleted ${roleId}` };
  }
}
