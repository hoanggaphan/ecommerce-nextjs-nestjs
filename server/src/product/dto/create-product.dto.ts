import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { nameRegex, slugRegex } from './../../libs/regex';

class CategoryDto {
  @IsInt()
  id: number;
}

class ImageDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsString()
  url: string;
}

class AttributeValueDto {
  @IsInt()
  id: number;
}

export class CreateProductDto {
  @Length(2, 200)
  @Matches(nameRegex, {
    message: 'name must contains at least 2 letter, no special letters',
  })
  name: string;

  @Matches(slugRegex, {
    message: 'Slug is not valid',
  })
  slug: string;

  @IsInt()
  price: number;

  @IsInt()
  quantity: number;

  @ValidateNested()
  @Type(() => ImageDto)
  images: ImageDto[];

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isNew: boolean;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
  isPopular: boolean;

  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ValidateNested()
  @Type(() => AttributeValueDto)
  attributeValues: AttributeValueDto[];
}
