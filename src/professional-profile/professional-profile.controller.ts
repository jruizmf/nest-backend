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
import { ProfessionalProfileService } from './professional-profile.service';
import { CreateProfessionalProfileDto } from './dto/create-professional-profile.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';

@Controller('professionalprofile')
export class ProfessionalProfileController {
  constructor(
    private readonly professionalProfileService: ProfessionalProfileService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: Record<string, string>) {
    return this.professionalProfileService.findAll(query);
  }

  @Get(':profileId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.professionalProfileService.findOne(profileId);
  }

  @Post()
  async create(@Body() dto: CreateProfessionalProfileDto) {
    const data = await this.professionalProfileService.create(dto);
    return { data, message: 'Profile added succesfully' };
  }

  @Put(':profileId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() dto: UpdateProfessionalProfileDto,
  ) {
    return this.professionalProfileService.update(profileId, dto);
  }

  @Delete(':profileId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('profileId', ParseUUIDPipe) profileId: string) {
    await this.professionalProfileService.remove(profileId);
    return { message: `Profile deleted ${profileId}` };
  }
}
