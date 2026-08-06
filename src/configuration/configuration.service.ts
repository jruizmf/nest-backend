import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from '../entities/configuration.entity';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  findAll(query: Record<string, string>) {
    const { sort = 'code', page = '1', limit = '100', ...where } = query;
    return this.configurationRepository.find({
      where: Object.keys(where).length ? where : undefined,
      order: { [sort]: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }

  async findOne(id: string) {
    const config = await this.configurationRepository.findOneBy({ id });
    if (!config) {
      throw new NotFoundException(`There is no configurations with ID:${id}`);
    }
    return config;
  }

  create(dto: CreateConfigurationDto) {
    const config = this.configurationRepository.create({
      ...dto,
      date_added: new Date(),
    });
    return this.configurationRepository.save(config);
  }

  async update(id: string, dto: UpdateConfigurationDto) {
    const config = await this.findOne(id);
    Object.assign(config, dto, { date_modified: new Date() });
    return this.configurationRepository.save(config);
  }

  async remove(id: string) {
    await this.configurationRepository.delete(id);
  }
}
