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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: Record<string, string>) {
    return this.usersService.findAll(query);
  }

  // Must come before ':userId' or Express would try to match "byusername" as an id.
  @Get('byusername/:username')
  async findByUsername(@Param('username') username: string) {
    const { taken } = await this.usersService.findByUsername(username);
    return taken
      ? { message: 'Username isset, please try with other.' }
      : { message: 'There is no users registered' };
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.findOne(userId);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { user, message: 'User added succesfully' };
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, dto);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.usersService.remove(userId);
    return { message: `User deleted ${userId}` };
  }
}
