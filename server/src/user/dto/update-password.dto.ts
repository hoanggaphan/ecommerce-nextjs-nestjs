import { IsInt, Length, Matches } from 'class-validator';
import { passwordRegex } from './../../libs/regex';

export class UpdatePasswordDto {
  @IsInt()
  userId: number;

  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  oldPass: string;

  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  confirmPass: string;

  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  newPass: string;
}
