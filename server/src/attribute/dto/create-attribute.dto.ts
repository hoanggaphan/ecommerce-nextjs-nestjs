import { Length, Matches } from 'class-validator';
import { nameRegex } from '../../libs/regex';

export class CreateAttributeDto {
  @Length(2, 50)
  @Matches(nameRegex, {
    message: 'name must contains at least 2 letter, no special letters',
  })
  name: string;
}
