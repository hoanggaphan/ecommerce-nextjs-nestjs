import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantOption } from 'src/variant/entities/variantOption.entity';
import { CategoryModule } from './../category/category.module';
import { OptionModule } from './../option/option.module';
import { Variant } from './../variant/entities/variant.entity';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Variant, VariantOption]),
    OptionModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
