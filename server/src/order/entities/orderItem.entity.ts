import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './../../product/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public orderId!: number;

  @Column()
  public productId!: number;

  @Column({ nullable: false })
  orderedPrice: number;

  @Column({ nullable: false })
  orderedQuantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  public order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  public product!: Product;
}
