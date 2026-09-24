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
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.subCategoryService.findAll(query);
  }

  @Get(':subCategoryId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('subCategoryId', ParseUUIDPipe) subCategoryId: string) {
    return this.subCategoryService.findOne(subCategoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateSubCategoryDto) {
    const data = await this.subCategoryService.create(dto);
    return { data, message: 'SubCategory added succesfully' };
  }

  @Put(':subCategoryId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('subCategoryId', ParseUUIDPipe) subCategoryId: string,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(subCategoryId, dto);
  }

  @Delete(':subCategoryId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('subCategoryId', ParseUUIDPipe) subCategoryId: string) {
    await this.subCategoryService.remove(subCategoryId);
    return { message: `SubCategory deleted ${subCategoryId}` };
  }
}
