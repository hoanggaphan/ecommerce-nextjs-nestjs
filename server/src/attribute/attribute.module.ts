import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeAdminController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { Attribute } from './entities/attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])],
  controllers: [AttributeAdminController],
  providers: [AttributeService],
  exports: [AttributeService],
})
export class AttributeModule {}
