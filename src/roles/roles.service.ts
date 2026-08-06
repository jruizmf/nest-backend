import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  findAll(query: Record<string, string>) {
    const { sort = 'name', page = '1', limit = '100', ...where } = query;
    return this.rolesRepository.find({
      where: Object.keys(where).length ? where : undefined,
      order: { [sort]: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`There is no roles with ID:${id}`);
    }
    return role;
  }

  create(dto: CreateRoleDto) {
    const role = this.rolesRepository.create({
      ...dto,
      date_added: new Date(),
    });
    return this.rolesRepository.save(role);
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, dto, { date_modified: new Date() });
    return this.rolesRepository.save(role);
  }

  async remove(id: string) {
    await this.rolesRepository.delete(id);
  }
}
