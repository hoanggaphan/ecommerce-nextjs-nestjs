import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from '../../option/entities/option.entity';

@Entity()
export class OptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  value: string;

  @ManyToOne(() => Option, (option) => option.optionValues)
  option: Option;
}
