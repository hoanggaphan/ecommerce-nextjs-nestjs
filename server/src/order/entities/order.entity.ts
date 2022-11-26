import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../../enums/orderStatus.enum';
import { User } from './../../user/entities/user.entity';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  phone: number;

  @Column({ nullable: false })
  address: string;

  @Column()
  note: string;

  @Column({ nullable: false, default: 0 })
  shippingCost: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderStatus,
    default: OrderStatus.Processing,
  })
  orderStatus: OrderStatus;

  @Column({ nullable: false })
  totalPrice: number;

  @Column({ nullable: false, default: 'COD' })
  paymentMethod: string;

  @Column({
    nullable: false,
    default: false,
  })
  isPaid: boolean;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  public orderItems!: OrderItem[];

  @Column({ nullable: true })
  paidDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
