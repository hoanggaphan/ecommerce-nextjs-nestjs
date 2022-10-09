import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VariantService } from './variant.service';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get()
  findAll() {
    return this.variantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.findOne(id);
  }
}
