import { RolesGuard } from './../guards/roles.guard';
import { AccessTokenGuard } from './../auth/access-token.guard';
import { Role } from './../enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorator/role.decorator';
import { AttributeValueService } from './attribute-value.service';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';

// @Controller('attribute-value')
// export class AttributeValueController {
//   constructor(private readonly attributeValueService: AttributeValueService) {}

//   @Post()
//   create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
//     return this.attributeValueService.create(createAttributeValueDto);
//   }

//   @Get()
//   findAll() {
//     return this.attributeValueService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.attributeValueService.findOne(+id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateAttributeValueDto: UpdateAttributeValueDto,
//   ) {
//     return this.attributeValueService.update(+id, updateAttributeValueDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.attributeValueService.remove(+id);
//   }
// }

@Controller('admin/attribute-value')
@Roles(Role.Admin, Role.Manager)
@UseGuards(AccessTokenGuard, RolesGuard)
export class AttributeValueAdminController {
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
