import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionModule } from './../option/option.module';
import { OptionValue } from './entities/option-value.entity';
import { OptionValueController } from './option-value.controller';
import { OptionValueService } from './option-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([OptionValue]), OptionModule],
  controllers: [OptionValueController],
  providers: [OptionValueService],
  exports: [OptionValueService],
})
export class OptionValueModule {}
