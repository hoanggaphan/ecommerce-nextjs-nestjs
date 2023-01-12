import { IsEnum } from 'class-validator';
import { Role } from './../../enums/role.enum';
import { CreateUserDto } from './create-user.dto';

export class CreateEmployeeDto extends CreateUserDto {
  @IsEnum(Role, { each: true })
  roles: Role[];
}
