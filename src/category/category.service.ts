import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(query: Record<string, string>) {
    const { sort = 'name', page = '1', limit = '100', ...where } = query;
    return this.categoryRepository.find({
      where: Object.keys(where).length ? where : undefined,
      order: { [sort]: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { menus: true },
    });
    if (!category) {
      throw new NotFoundException(`There is no categories with ID:${id}`);
    }
    return category;
  }

  create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      ...dto,
      date_added: new Date(),
    });
    return this.categoryRepository.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto, { date_modified: new Date() });
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    await this.categoryRepository.delete(id);
  }
}
