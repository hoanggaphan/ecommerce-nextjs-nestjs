import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule {}
