import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributesRepository: Repository<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto) {
    const name = await this.attributesRepository.findOneBy({
      name: createAttributeDto.name,
    });
    if (name) throw new BadRequestException('Name already exist');

    return this.attributesRepository.save(createAttributeDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'Register success',
    }));
  }

  findAll(): Promise<Attribute[]> {
    return this.attributesRepository.find({
      relations: { attributeValues: true },
    });
  }

  async findOne(id: number): Promise<Attribute> {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Attribute not found.');
    }

    return exist;
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Attribute not found.');
    }
    const name = await this.attributesRepository
      .createQueryBuilder('attribute')
      .where('attribute.name = :nameUpdate and attribute.name != :nameExist', {
        nameUpdate: updateAttributeDto.name,
        nameExist: exist.name,
      })
      .getOne();
    if (name) throw new BadRequestException('Name already exist');

    return this.attributesRepository
      .update(id, updateAttributeDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'Update success',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return this.attributesRepository.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
