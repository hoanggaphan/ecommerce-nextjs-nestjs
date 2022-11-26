import { Order } from './../order/entities/order.entity';
import { OrderItem } from './../order/entities/orderItem.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { In, Like, Repository } from 'typeorm';
import { Image } from './../image/entities/image.entity';
import { Variant } from './../variant/entities/variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Image)
    private imageRepo: Repository<Image>,
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async topSelling() {
    // Select Product.name, SUM(OderItem.orderedQuantity) as sold
    // from Product, Variant, OrderItem, Order
    // where Product.id = Variant.productId
    //    and Variant.id = OderItem.VariantId
    //    and OderItem.OrderId = Order.id
    // having sold > 0
    // limit 6
    // group by Product.name

    return this.productRepo
      .createQueryBuilder('product')
      .select('product.name', 'name')
      .addSelect('SUM(oi.orderedQuantity)', 'sold')
      .leftJoin(Variant, 'v', 'product.id = v.productId')
      .leftJoin(OrderItem, 'oi', 'v.id = oi.variantId')
      .leftJoin(Order, 'o', 'o.id = oi.orderId')
      .groupBy('product.name')
      .having('sold > 0')
      .orderBy('sold', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async findAllForAdmin(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {
        name: Like(`%${name}%`),
      },
      relations: {
        category: true,
        images: true,
        variants: true,
      },
      order: {
        updatedDate: 'DESC',
      },
    });
  }

  async findAllForUser(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {
        isActive: true,
        name: Like(`%${name}%`),
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async findNew(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {
        isNew: true,
        isActive: true,
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        images: true,
        variants: true,
      },
    });
  }

  async findPopular(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {
        isPopular: true,
        isActive: true,
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        images: true,
        variants: true,
      },
    });
  }

  findAll(): Promise<Product[]> {
    return this.productRepo.find({
      relations: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    const exist = await this.productRepo.find({
      where: { id: In(ids), isActive: true },
      relations: {
        category: true,
        images: true,
        variants: true,
      },
    });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return exist;
  }

  async findById(id: number): Promise<Product> {
    const exist = await this.productRepo.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        variants: {
          attributeValues: {
            attribute: true,
          },
        },
      },
    });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return exist;
  }

  async findBySlugForUser(slug: string): Promise<Product> {
    const exist = await this.productRepo.findOne({
      where: { slug, isActive: true },
      relations: {
        category: true,
        images: true,
        variants: {
          attributeValues: {
            attribute: true,
          },
        },
      },
    });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return exist;
  }

  async findByCategoryForUser(slug: string): Promise<Product[]> {
    return await this.productRepo.find({
      where: {
        category: {
          slug,
        },
        isActive: true,
      },
      relations: {
        images: true,
        variants: {
          attributeValues: {
            attribute: true,
          },
        },
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const name = await this.productRepo.findOneBy({
      name: createProductDto.name,
    });
    if (name) throw new BadRequestException('Name already exist');

    const slug = await this.productRepo.findOneBy({
      slug: createProductDto.slug,
    });
    if (slug) throw new BadRequestException('Slug already exist');

    const { images, variants } = createProductDto;

    let duplicateVariant = false;
    for (let i = 0; i < variants.length; i++) {
      const curr = variants[i].attributeValues;
      for (let j = i + 1; j < variants.length; j++) {
        const next = variants[j].attributeValues;
        if (JSON.stringify(curr) === JSON.stringify(next)) {
          duplicateVariant = true;
          break;
        }
      }
    }
    if (duplicateVariant)
      throw new BadRequestException('Duplicate variant attributes');

    await this.imageRepo.save(images);
    await this.variantRepo.save(variants);
    return this.productRepo.save({ ...createProductDto });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const exist = await this.productRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }
    const name = await this.productRepo
      .createQueryBuilder('product')
      .where('product.name = :nameUpdate and product.name != :nameExist', {
        nameUpdate: updateProductDto.name,
        nameExist: exist.name,
      })
      .getOne();

    if (name) throw new BadRequestException('Name already exist');

    const slug = await this.productRepo
      .createQueryBuilder('product')
      .where('product.slug = :slugUpdate and product.slug != :slugExist', {
        slugUpdate: updateProductDto.slug,
        slugExist: exist.slug,
      })
      .getOne();
    if (slug) throw new BadRequestException('Slug already exist');

    const { images, variants } = updateProductDto;

    let duplicateVariant = false;
    for (let i = 0; i < variants.length; i++) {
      const curr = variants[i].attributeValues;
      for (let j = i + 1; j < variants.length; j++) {
        const next = variants[j].attributeValues;
        if (JSON.stringify(curr) === JSON.stringify(next)) {
          duplicateVariant = true;
          break;
        }
      }
    }
    if (duplicateVariant)
      throw new BadRequestException('Duplicate variant attributes');

    await this.imageRepo.save(images);
    await this.variantRepo.save(variants);
    return this.productRepo.save({ id, ...updateProductDto });
  }

  async remove(id: number) {
    const exist = await this.productRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return this.productRepo.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }

  async count() {
    return await this.productRepo.count();
  }
}
