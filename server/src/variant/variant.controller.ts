import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantService } from './variant.service';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto);
  }

  @Get()
  findAll() {
    return this.variantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.variantService.update(id, updateVariantDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.remove(id);
  }
}
