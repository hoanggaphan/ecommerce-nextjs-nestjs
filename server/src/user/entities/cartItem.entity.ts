import { User } from './user.entity';
import { Product } from './../../product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public userId!: number;

  @Column()
  public productId!: number;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne(() => User, (user) => user.cartItems)
  public user!: User;

  @ManyToOne(() => Product, (product) => product.cartItems)
  public product!: Product;
}
