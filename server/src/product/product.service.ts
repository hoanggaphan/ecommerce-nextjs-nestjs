import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './../category/category.service';
import { Image } from './../image/entities/image.entity';
import { OptionService } from './../option/option.service';
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
    private optionService: OptionService,
    private categoryService: CategoryService,
  ) {}

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
        optionValues: {
          option: true,
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
        optionValues: {
          option: true,
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
