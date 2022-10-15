import { OrderItem } from 'src/order/entities/orderItem.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './../../category/entities/category.entity';
import { Image } from './../../image/entities/image.entity';
import { OptionValue } from './../../option-value/entities/option-value.entity';
import { CartItem } from './../../user/entities/cartItem.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false, default: false })
  isNew: boolean;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @Column({ nullable: false, default: false })
  isPopular: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => OptionValue)
  @JoinTable()
  optionValues: OptionValue[];

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  public orderItems!: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  public cartItems!: CartItem[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
