import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './../variant/entities/variant.entity';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { AttributeValue } from './entities/attribute-value.entity';

@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValue)
    private attributeValuesRepository: Repository<AttributeValue>,
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async create(createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeValuesRepository
      .save(createAttributeValueDto)
      .then((res) => ({
        statusCode: HttpStatus.CREATED,
        message: 'Register success',
      }));
  }

  findAll() {
    return this.attributeValuesRepository.find();
  }

  async findOne(id: number) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    return exist;
  }

  async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    return this.attributeValuesRepository
      .update(id, updateAttributeValueDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'Update success',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    const existVariants = await this.variantRepo.findBy({
      attributeValues: { id },
    });

    if (existVariants.length > 0) {
      throw new InternalServerErrorException(
        "Can't delete because it's linked",
      );
    }

    try {
      return await this.attributeValuesRepository
        .delete({ id })
        .then((res) => ({
          statusCode: HttpStatus.OK,
          message: 'Delete success',
        }));
    } catch (error) {
      if (error.errno === 1451) {
        throw new InternalServerErrorException(
          "Can't delete because it's linked",
        );
      }
      throw new InternalServerErrorException();
    }
  }
}
