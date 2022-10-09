import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,
  ) {}

  findAll() {
    return this.variantsRepository.find();
  }

  async findOne(id: number) {
    const exist = await this.variantsRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Variant not found.');
    }

    return exist;
  }
}
