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
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('userprofile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: Record<string, string>) {
    return this.userProfileService.findAll(query);
  }

  @Get(':profileId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.userProfileService.findOne(profileId);
  }

  @Post()
  async create(@Body() dto: CreateUserProfileDto) {
    const data = await this.userProfileService.create(dto);
    return { data, message: 'Profile added succesfully' };
  }

  @Put(':profileId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.update(profileId, dto);
  }

  @Delete(':profileId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('profileId', ParseUUIDPipe) profileId: string) {
    await this.userProfileService.remove(profileId);
    return { message: `Profile deleted ${profileId}` };
  }
}
