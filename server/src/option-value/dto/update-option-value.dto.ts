import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionValueDto } from './create-option-value.dto';

export class UpdateOptionValueDto extends PartialType(CreateOptionValueDto) {}
