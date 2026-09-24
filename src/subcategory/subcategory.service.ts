import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/subcategory.entity';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  findAll(query: Record<string, string>) {
    const { sort = 'name', page = '1', limit = '100', ...where } = query;
    return this.subCategoryRepository.find({
      where: Object.keys(where).length ? where : undefined,
      relations: { category: true },
      order: { [sort]: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!subCategory) {
      throw new NotFoundException(`There is no subcategories with ID:${id}`);
    }
    return subCategory;
  }

  create(dto: CreateSubCategoryDto) {
    const subCategory = this.subCategoryRepository.create({
      ...dto,
      date_added: new Date(),
    });
    return this.subCategoryRepository.save(subCategory);
  }

  async update(id: string, dto: UpdateSubCategoryDto) {
    const subCategory = await this.findOne(id);
    Object.assign(subCategory, dto, { date_modified: new Date() });
    return this.subCategoryRepository.save(subCategory);
  }

  async remove(id: string) {
    await this.subCategoryRepository.delete(id);
  }
}
