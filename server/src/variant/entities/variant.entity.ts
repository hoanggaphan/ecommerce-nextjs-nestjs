import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttributeValue } from './../../attribute-value/entities/attribute-value.entity';
import { OrderItem } from './../../order/entities/orderItem.entity';
import { Product } from './../../product/entities/product.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  product: Product;

  @ManyToMany(() => AttributeValue)
  @JoinTable({
    name: 'variant_attribute_value',
  })
  attributeValues: AttributeValue[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.variant)
  public orderItems!: OrderItem[];
}
