import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attribute } from '../../attribute/entities/attribute.entity';

@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  value: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.attributeValues)
  attribute: Attribute;
}
