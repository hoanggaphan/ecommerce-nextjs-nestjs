import { IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { Role } from './../../enums/role.enum';
import { passwordRegex, usernameRegex } from './../../libs/regex';

export class UpdateAccountDto {
  @IsOptional()
  @Length(6, 32)
  @Matches(usernameRegex, {
    message:
      'Username must contains at least 6 letter, no space, no special letters',
  })
  username: string;

  @IsOptional()
  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
