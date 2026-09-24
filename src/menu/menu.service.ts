import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  findAll(query: Record<string, string>) {
    const { sort = 'name', page = '1', limit = '100', ...where } = query;
    return this.menuRepository.find({
      where: Object.keys(where).length ? where : undefined,
      relations: { category: true },
      order: { [sort]: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }

  async findOne(id: string) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!menu) {
      throw new NotFoundException(`There is no menus with ID:${id}`);
    }
    return menu;
  }

  create(dto: CreateMenuDto) {
    const menu = this.menuRepository.create({
      ...dto,
      date_added: new Date(),
    });
    return this.menuRepository.save(menu);
  }

  async update(id: string, dto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    Object.assign(menu, dto, { date_modified: new Date() });
    return this.menuRepository.save(menu);
  }

  async remove(id: string) {
    await this.menuRepository.delete(id);
  }
}
