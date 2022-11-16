import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { nameRegex, slugRegex } from './../../libs/regex';

export class CreateCategoryDto {
  @Length(2, 200)
  @Matches(nameRegex, {
    message: 'Username must contains at least 2 letter, no special letters',
  })
  name: string;

  @Matches(slugRegex, {
    message: 'Slug is not valid',
  })
  slug: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsString()
  @MaxLength(200)
  description: string;
}
