import { Type } from 'class-transformer';
import { IsInt, Length, ValidateNested } from 'class-validator';

class OptionDto {
  @IsInt()
  id: number;
}

export class CreateOptionValueDto {
  @Length(1, 50)
  value: string;

  @ValidateNested()
  @Type(() => OptionDto)
  option: OptionDto;
}
