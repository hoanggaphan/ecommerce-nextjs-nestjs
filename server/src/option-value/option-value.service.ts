import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionService } from './../option/option.service';
import { CreateOptionValueDto } from './dto/create-option-value.dto';
import { UpdateOptionValueDto } from './dto/update-option-value.dto';
import { OptionValue } from './entities/option-value.entity';

@Injectable()
export class OptionValueService {
  constructor(
    @InjectRepository(OptionValue)
    private optionValuesRepository: Repository<OptionValue>,
    private optionService: OptionService,
  ) {}

  async create(createOptionValueDto: CreateOptionValueDto) {
    return this.optionValuesRepository
      .save(createOptionValueDto)
      .then((res) => ({
        statusCode: HttpStatus.CREATED,
        message: 'Register success',
      }));
  }

  findAll() {
    return this.optionValuesRepository.find();
  }

  async findOne(id: number) {
    const exist = await this.optionValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    return exist;
  }

  async update(id: number, updateOptionValueDto: UpdateOptionValueDto) {
    const exist = await this.optionValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    return this.optionValuesRepository
      .update(id, updateOptionValueDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'Update success',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.optionValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    return this.optionValuesRepository.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
