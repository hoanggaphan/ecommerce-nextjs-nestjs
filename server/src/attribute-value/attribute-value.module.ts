import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from '../attribute/attribute.module';
import { Variant } from './../variant/entities/variant.entity';
import { AttributeValueAdminController } from './attribute-value.controller';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValue } from './entities/attribute-value.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeValue, Variant]),
    AttributeModule,
  ],
  controllers: [AttributeValueAdminController],
  providers: [AttributeValueService],
  exports: [AttributeValueService],
})
export class AttributeValueModule {}
