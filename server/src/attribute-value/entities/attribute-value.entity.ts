import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { Variant } from './../../variant/entities/variant.entity';

@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  value: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.attributeValues, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  attribute: Attribute;

  @ManyToMany(() => Variant)
  variants: Variant[];
}
