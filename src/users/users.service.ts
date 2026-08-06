import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
  ) {}

  findAll(query: Record<string, string>) {
    const { sort = 'name', page = '1', limit = '100', ...where } = query;
    return this.usersRepository.find({
      where: Object.keys(where).length ? where : undefined,
      order: { [sort]: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`There is no users with ID:${id}`);
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    return { taken: user !== null };
  }

  async create(dto: CreateUserDto) {
    const { role, ...userData } = dto;
    const salt = bcrypt.genSaltSync(14);
    const user = this.usersRepository.create({
      ...userData,
      password: bcrypt.hashSync(dto.password, salt),
      date_added: new Date(),
    });
    const saved = await this.usersRepository.save(user);

    if (role?.length) {
      await this.assignRoles(saved.id, role);
    }

    return saved;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { role, ...userData } = dto;
    const user = await this.findOne(id);

    if (userData.password) {
      const salt = bcrypt.genSaltSync(14);
      userData.password = bcrypt.hashSync(userData.password, salt);
    }

    Object.assign(user, userData, { date_modified: new Date() });
    const saved = await this.usersRepository.save(user);

    if (role?.length) {
      await this.assignRoles(id, role);
    }

    return saved;
  }

  async remove(id: string) {
    await this.usersRepository.delete(id);
  }

  private async assignRoles(userId: string, roleIds: string[]) {
    await this.userRolesRepository.delete({ userId });
    const links = roleIds.map((roleId) =>
      this.userRolesRepository.create({ userId, roleId }),
    );
    await this.userRolesRepository.save(links);
  }
}
