import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { OptionValueModule } from './option-value/option-value.module';
import { OptionModule } from './option/option.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_NAME as any,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as any,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    OptionModule,
    OptionValueModule,
  ],
})
export class AppModule {}
