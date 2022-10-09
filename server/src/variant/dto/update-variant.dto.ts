import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantDto } from './create-variant.dto';

export class UpdateVariantDto extends PartialType(CreateVariantDto) {}
