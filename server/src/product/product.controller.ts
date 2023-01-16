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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name = '',
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllForUser(
      {
        page,
        limit,
        route: `${process.env.SERVER}/product`,
      },
      name,
    );
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

  @Get('/category/:slug')
  findProductByCategory(@Param('slug') slug: string) {
    return this.productService.findByCategoryForUser(slug);
  }
}

@Controller('admin/product')
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('top-selling')
  async topSelling() {
    return this.productService.topSelling();
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('total-product')
  async totalProduct() {
    return this.productService.count();
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get()
  async findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('name') name = '',
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllForAdmin(
      {
        page,
        limit,
        route: `${process.env.SERVER}/admin/product`,
      },
      name,
    );
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Roles(Role.Admin, Role.Manager)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Roles(Role.Admin, Role.Manager)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(Role.Admin, Role.Manager)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
