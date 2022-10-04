import { Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @Length(0, 32)
  fullName: string;

  @Matches(/((03|05|07|08|09)+([0-9]{8})\b)/, {
    message: 'Phone number not valid',
  })
  phone: string;

  @Length(0, 300)
  address: string;
}
