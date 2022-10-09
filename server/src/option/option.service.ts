import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entities/option.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>,
  ) {}

  async create(createOptionDto: CreateOptionDto) {
    const name = await this.optionsRepository.findOneBy({
      name: createOptionDto.name,
    });
    if (name) throw new BadRequestException('Name already exist');

    return this.optionsRepository.save(createOptionDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'Register success',
    }));
  }

  findAll(): Promise<Option[]> {
    return this.optionsRepository.find();
  }

  async findOne(id: number): Promise<Option> {
    const exist = await this.optionsRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Option not found.');
    }

    return exist;
  }

  async update(id: number, updateOptionDto: UpdateOptionDto) {
    const exist = await this.optionsRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Option not found.');
    }
    const name = await this.optionsRepository
      .createQueryBuilder('option')
      .where('option.name = :nameUpdate and option.name != :nameExist', {
        nameUpdate: updateOptionDto.name,
        nameExist: exist.name,
      })
      .getOne();
    if (name) throw new BadRequestException('Name already exist');

    return this.optionsRepository
      .update(id, updateOptionDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'Update success',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.optionsRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return this.optionsRepository.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
