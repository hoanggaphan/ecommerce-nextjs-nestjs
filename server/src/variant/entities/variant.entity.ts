import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './../../product/entities/product.entity';
import { VariantOption } from './variantOption.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { nullable: false, precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  product: Product;

  @OneToMany(() => VariantOption, (variantOption) => variantOption.variant)
  public variantOptions!: VariantOption[];
}
