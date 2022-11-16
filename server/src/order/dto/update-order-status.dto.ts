import { IsBoolean, IsEnum } from 'class-validator';
import { OrderStatus } from './../../enums/orderStatus.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsBoolean()
  isPaid: boolean;
}
