import { IsDecimal, IsInt } from 'class-validator';

export class CreateVariantDto {
  @IsDecimal()
  price: number;

  @IsInt()
  quantity: number;

  @IsInt()
  productId: number;
}
