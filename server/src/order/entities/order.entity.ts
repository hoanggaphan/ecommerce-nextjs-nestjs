import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from './../../enums/status.enum';
import { User } from './../../user/entities/user.entity';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  orderDate: Date;

  @Column({ nullable: false })
  shipCost: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Status,
    default: Status.Pending,
  })
  status: Status;

  @Column({ nullable: false })
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  public orderItems!: OrderItem[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
