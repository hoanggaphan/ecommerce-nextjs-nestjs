import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class UserDto {
  @IsInt()
  id: number;
}

class OrderItemDto {
  @IsOptional()
  @IsInt()
  orderId: number;

  @IsInt()
  variantId: number;

  @IsInt()
  orderedPrice: number;

  @IsInt()
  orderedQuantity: number;
}

export class CreateOrderDto {
  @IsString()
  fullName: string;

  @IsInt()
  phone: number;

  @IsString()
  address: string;

  @IsString()
  note: string;

  @IsOptional()
  @IsInt()
  shippingCost: number;

  @IsInt()
  totalPrice: number;

  @IsString()
  paymentMethod: string;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
