import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './../../category/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: false })
  active: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
