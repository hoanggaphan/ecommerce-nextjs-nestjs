import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OptionValue } from '../../option-value/entities/option-value.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => OptionValue, (optionValue) => optionValue.option)
  public optionValues!: OptionValue[];
}
