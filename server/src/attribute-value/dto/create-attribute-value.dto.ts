import { Type } from 'class-transformer';
import { IsInt, Length, ValidateNested } from 'class-validator';

class AttributeDto {
  @IsInt()
  id: number;
}

export class CreateAttributeValueDto {
  @Length(1, 50)
  value: string;

  @ValidateNested()
  @Type(() => AttributeDto)
  attribute: AttributeDto;
}
