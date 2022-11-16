import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async findByIds(ids: number[]): Promise<Variant[]> {
    return await this.variantRepo.find({
      where: {
        id: In(ids),
        product: {
          isActive: true,
        },
      },
      relations: {
        product: {
          images: true,
        },
        attributeValues: true,
      },
    });
  }

  // create(createVariantDto: CreateVariantDto) {
  //   return 'This action adds a new variant';
  // }

  // findAll() {
  //   return `This action returns all variant`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} variant`;
  // }

  // update(id: number, updateVariantDto: UpdateVariantDto) {
  //   return `This action updates a #${id} variant`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} variant`;
  // }
}
