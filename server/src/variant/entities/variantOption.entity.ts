import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Option } from './../../option/entities/option.entity';
import { Variant } from './variant.entity';

@Entity()
export class VariantOption {
  @PrimaryColumn()
  public variantId!: number;

  @PrimaryColumn()
  public optionId!: number;

  @Column({ unique: true, nullable: false })
  value: string;

  @ManyToOne(() => Variant, (variant) => variant.variantOptions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public variant!: Variant;

  @ManyToOne(() => Option, (option) => option.variantOptions)
  public option!: Option;
}