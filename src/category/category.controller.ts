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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.categoryService.findAll(query);
  }

  @Get(':categoryId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.categoryService.findOne(categoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCategoryDto) {
    const data = await this.categoryService.create(dto);
    return { data, message: 'Category added succesfully' };
  }

  @Put(':categoryId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(categoryId, dto);
  }

  @Delete(':categoryId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    await this.categoryService.remove(categoryId);
    return { message: `Category deleted ${categoryId}` };
  }
}
