import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from '../decorator/role.decorator';
import { AccessTokenGuard } from './../auth/access-token.guard';
import { Role } from './../enums/role.enum';
import { RolesGuard } from './../guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllForUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllForUser({
      page,
      limit,
      route: `${process.env.SERVER}/product`,
    });
  }

  @Post('cart-items')
  async findAllByIds(@Body() ids: number[]) {
    return this.productService.findByIds(ids);
  }

  @Get('new')
  async findNew(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit = 4,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findNew({
      page,
      limit,
      route: `${process.env.SERVER}/product/new`,
    });
  }

  @Get('popular')
  async findPopular(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit = 4,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findPopular({
      page,
      limit,
      route: `${process.env.SERVER}/product/popular`,
    });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlugForUser(slug);
  }
}

@Controller('admin/product')
@Roles(Role.Admin)
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllForAdmin({
      page,
      limit,
      route: `${process.env.SERVER}/admin/product`,
    });
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
