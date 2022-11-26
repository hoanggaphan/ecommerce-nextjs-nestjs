import { IsBoolean, IsEnum, IsISO8601, IsOptional } from 'class-validator';
import { OrderStatus } from './../../enums/orderStatus.enum';

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsOptional()
  @IsBoolean()
  isPaid: boolean;

  @IsOptional()
  @IsISO8601()
  paidDate: string;
}
