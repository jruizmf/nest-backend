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
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller('configuration')
@UseGuards(JwtAuthGuard)
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.configurationService.findAll(query);
  }

  @Get(':configurationId')
  findOne(@Param('configurationId', ParseUUIDPipe) configurationId: string) {
    return this.configurationService.findOne(configurationId);
  }

  @Post()
  async create(@Body() dto: CreateConfigurationDto) {
    const data = await this.configurationService.create(dto);
    return { data, message: 'Configuration added succesfully' };
  }

  @Put(':configurationId')
  update(
    @Param('configurationId', ParseUUIDPipe) configurationId: string,
    @Body() dto: UpdateConfigurationDto,
  ) {
    return this.configurationService.update(configurationId, dto);
  }

  @Delete(':configurationId')
  async remove(
    @Param('configurationId', ParseUUIDPipe) configurationId: string,
  ) {
    await this.configurationService.remove(configurationId);
    return { message: `Configuration deleted ${configurationId}` };
  }
}
