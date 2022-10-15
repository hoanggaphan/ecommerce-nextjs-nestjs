import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AttributeValueService } from './attribute-value.service';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';

@Controller('attribute-value')
export class AttributeValueController {
  constructor(private readonly attributeValueService: AttributeValueService) {}

  @Post()
  create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeValueService.create(createAttributeValueDto);
  }

  @Get()
  findAll() {
    return this.attributeValueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeValueService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    return this.attributeValueService.update(+id, updateAttributeValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeValueService.remove(+id);
  }
}
