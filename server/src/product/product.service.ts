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
import { Repository } from 'typeorm';
import { Image } from './../image/entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async findAllForAdmin(
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    return paginate<Product>(this.productsRepository, options, {
      relations: {
        category: true,
        images: true,
        attributeValues: {
          attribute: true,
        },
      },
      order: {
        updatedDate: 'DESC',
      },
    });
  }

  async findAllForUser(
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    return paginate<Product>(this.productsRepository, options, {
      where: {
        isActive: true,
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        category: true,
        images: true,
        attributeValues: {
          attribute: true,
        },
      },
    });
  }

  async findNew(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productsRepository, options, {
      where: {
        isNew: true,
        isActive: true,
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        images: true,
      },
    });
  }

  async findPopular(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productsRepository, options, {
      where: {
        isPopular: true,
        isActive: true,
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        images: true,
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const name = await this.productsRepository.findOneBy({
      name: createProductDto.name,
    });
    if (name) throw new BadRequestException('Name already exist');

    const slug = await this.productsRepository.findOneBy({
      slug: createProductDto.slug,
    });
    if (slug) throw new BadRequestException('Slug already exist');

    const { images } = createProductDto;

    await this.imagesRepository.save(images);
    return this.productsRepository.save({ ...createProductDto });
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: {
        category: true,
        images: true,
        attributeValues: {
          attribute: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const exist = await this.productsRepository.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        attributeValues: {
          attribute: true,
        },
      },
    });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return exist;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const exist = await this.productsRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }
    const name = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.name = :nameUpdate and product.name != :nameExist', {
        nameUpdate: updateProductDto.name,
        nameExist: exist.name,
      })
      .getOne();

    if (name) throw new BadRequestException('Name already exist');

    const slug = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.slug = :slugUpdate and product.slug != :slugExist', {
        slugUpdate: updateProductDto.slug,
        slugExist: exist.slug,
      })
      .getOne();
    if (slug) throw new BadRequestException('Slug already exist');

    const { images } = updateProductDto;

    await this.imagesRepository.save(images);
    return this.productsRepository.save({ id, ...updateProductDto });
  }

  async remove(id: number) {
    const exist = await this.productsRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return this.productsRepository.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
