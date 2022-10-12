import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OptionValueService } from './option-value.service';
import { CreateOptionValueDto } from './dto/create-option-value.dto';
import { UpdateOptionValueDto } from './dto/update-option-value.dto';

@Controller('option-value')
export class OptionValueController {
  constructor(private readonly optionValueService: OptionValueService) {}

  @Post()
  create(@Body() createOptionValueDto: CreateOptionValueDto) {
    return this.optionValueService.create(createOptionValueDto);
  }

  @Get()
  findAll() {
    return this.optionValueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionValueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionValueDto: UpdateOptionValueDto) {
    return this.optionValueService.update(+id, updateOptionValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionValueService.remove(+id);
  }
}
