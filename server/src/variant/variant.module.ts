import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantOption } from './entities/variantOption.entity';
import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, VariantOption])],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
