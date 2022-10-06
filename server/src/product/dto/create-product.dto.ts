import {
  IsBoolean,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { nameRegex, slugRegex, urlRegex } from './../../libs/regex';

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
  image: string;

  @IsString()
  @MaxLength(200)
  description: string;

  @IsBoolean()
  active: boolean;
}
