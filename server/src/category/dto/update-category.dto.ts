import { PartialType } from '@nestjs/mapped-types';
import { Length, Matches, MaxLength } from 'class-validator';
import { nameRegex, slugRegex } from './../../libs/regex';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  subCategories: SubCategoryDto[];
}
class SubCategoryDto {
  @Length(2, 50)
  @Matches(nameRegex, {
    message: 'Username must contains at least 2 letter, no special letters',
  })
  name: string;

  @MaxLength(20)
  @Matches(slugRegex, {
    message: 'Slug is not valid',
  })
  slug: string;
}
