import { Length, Matches } from 'class-validator';

export class CreateUserDto {
  @Length(6, 32)
  @Matches(/^[a-z0-9_-]{6,32}$/, {
    message: 'Username must contains at least 6 letter and no space',
  })
  username: string;

  @Length(6, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  password: string;
}
