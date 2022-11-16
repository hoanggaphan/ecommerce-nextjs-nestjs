import { Body, Controller, Post } from '@nestjs/common';
import { VariantService } from './variant.service';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post('active')
  async findAllByIds(@Body() ids: number[]) {
    return this.variantService.findByIds(ids);
  }

  // @Post()
  // create(@Body() createVariantDto: CreateVariantDto) {
  //   return this.variantService.create(createVariantDto);
  // }

  // @Get()
  // findAll() {
  //   return this.variantService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.variantService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
  //   return this.variantService.update(+id, updateVariantDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.variantService.remove(+id);
  // }
}
