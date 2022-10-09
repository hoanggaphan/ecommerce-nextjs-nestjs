import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { nameRegex, slugRegex, urlRegex } from './../../libs/regex';

class NoOptionsDto {
  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;
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

  @IsOptional()
  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NoOptionsDto)
  noOptions: NoOptionsDto;
}

class VariantDto {
  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;

  @IsArray()
  options: OptionDto[];
}

class OptionDto {
  @IsInt()
  id: number;

  @IsString()
  value: string;
}
