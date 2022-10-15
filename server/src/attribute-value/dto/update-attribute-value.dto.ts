import { PartialType } from '@nestjs/mapped-types';
import { CreateAttributeValueDto } from './create-attribute-value.dto';

export class UpdateAttributeValueDto extends PartialType(
  CreateAttributeValueDto,
) {}
