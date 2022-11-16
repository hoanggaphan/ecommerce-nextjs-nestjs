import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from '../attribute/attribute.module';
import { CategoryModule } from './../category/category.module';
import { Image } from './../image/entities/image.entity';
import { Variant } from './../variant/entities/variant.entity';
import { Product } from './entities/product.entity';
import {
  ProductAdminController,
  ProductController,
} from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Image, Variant]),
    AttributeModule,
    CategoryModule,
  ],
  controllers: [ProductController, ProductAdminController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
