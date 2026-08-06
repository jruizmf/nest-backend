import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalProfile } from '../entities/professional-profile.entity';
import { CreateProfessionalProfileDto } from './dto/create-professional-profile.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';

@Injectable()
export class ProfessionalProfileService {
  constructor(
    @InjectRepository(ProfessionalProfile)
    private readonly repository: Repository<ProfessionalProfile>,
  ) {}

  findAll(query: Record<string, string>) {
    const { sort = 'date_added', page = '1', limit = '100', ...where } = query;
    return this.repository.find({
      where: Object.keys(where).length ? where : undefined,
      order: { [sort]: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }

  async findOne(id: string) {
    const profile = await this.repository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(`There is no profile with ID:${id}`);
    }
    return profile;
  }

  create(dto: CreateProfessionalProfileDto) {
    const profile = this.repository.create({ ...dto, date_added: new Date() });
    return this.repository.save(profile);
  }

  async update(id: string, dto: UpdateProfessionalProfileDto) {
    const profile = await this.findOne(id);
    Object.assign(profile, dto, { date_modified: new Date() });
    return this.repository.save(profile);
  }

  async remove(id: string) {
    await this.repository.delete(id);
  }
}
