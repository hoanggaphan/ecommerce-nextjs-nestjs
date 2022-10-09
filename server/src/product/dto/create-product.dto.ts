import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { nameRegex, slugRegex, urlRegex } from './../../libs/regex';

class CategoryDto {
  @IsInt()
  id: number;
}
class VariantOptionDto {
  @IsOptional()
  @IsInt()
  variantId: number;

  @IsInt()
  optionId: number;

  @IsString()
  value: string;
}
class VariantDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;

  @IsArray()
  variantOptions: VariantOptionDto[];
}

export class CreateProductDto {
  @Length(2, 50)
  @Matches(nameRegex, {
    message: 'name must contains at least 2 letter, no special letters',
  })
  name: string;

  @MaxLength(20)
  @Matches(slugRegex, {
    message: 'Slug is not valid',
  })
  slug: string;

  @Matches(urlRegex, {
    message: 'Image url is not valid',
  })
  previewImage: string;

  @IsString()
  @MaxLength(200)
  description: string;

  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
