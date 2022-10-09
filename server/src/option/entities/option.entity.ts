import { VariantOption } from 'src/variant/entities/variantOption.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => VariantOption, (variantOption) => variantOption.option)
  public variantOptions!: VariantOption[];
}
