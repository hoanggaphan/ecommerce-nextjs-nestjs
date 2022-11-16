import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './../../product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
