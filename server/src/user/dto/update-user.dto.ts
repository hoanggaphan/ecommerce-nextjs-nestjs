import { IsInt, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(0, 32)
  fullName: string;

  @IsOptional()
  @IsInt()
  phone: string;

  @IsOptional()
  @Length(0, 300)
  address: string;
}
