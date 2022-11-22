import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from './../../enums/orderStatus.enum';

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsBoolean()
  isPaid: boolean;
}
