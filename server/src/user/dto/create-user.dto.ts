import { Length, Matches } from 'class-validator';
import { passwordRegex, usernameRegex } from './../../libs/regex';

export class CreateUserDto {
  @Length(6, 32)
  @Matches(usernameRegex, {
    message:
      'Username must contains at least 6 letter, no space, no special letters',
  })
  username: string;

  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  password: string;
}
