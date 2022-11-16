import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
