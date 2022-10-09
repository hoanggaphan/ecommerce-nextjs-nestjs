import { ProductService } from './../product/product.service';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    return this.variantsRepository.save(createVariantDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'Register success',
    }));
  }

  findAll() {
    return `This action returns all variant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variant`;
  }

  update(id: number, updateVariantDto: UpdateVariantDto) {
    return `This action updates a #${id} variant`;
  }

  remove(id: number) {
    return `This action removes a #${id} variant`;
  }
}
