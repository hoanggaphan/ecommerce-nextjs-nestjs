import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariantOption } from 'src/variant/entities/variantOption.entity';
import { Repository } from 'typeorm';
import { CategoryService } from './../category/category.service';
import { OptionService } from './../option/option.service';
import { Variant } from './../variant/entities/variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,
    @InjectRepository(VariantOption)
    private variantOptionsRepository: Repository<VariantOption>,
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

    const { variants } = createProductDto;

    const newVariants = await this.variantsRepository.save(variants);
    const variantOptions = [];
    newVariants.forEach((v) =>
      v.variantOptions.forEach((vo) => {
        vo.variantId = v.id;
        variantOptions.push(vo);
      }),
    );
    await this.variantOptionsRepository.save(variantOptions);
    return this.productsRepository.save({ ...createProductDto });
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: { category: true, variants: { variantOptions: true } },
    });
  }

  async findOne(id: number): Promise<Product> {
    const exist = await this.productsRepository.findOneBy({ id });
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

    const { variants } = updateProductDto;

    const newVariants = await this.variantsRepository.save(variants);
    const variantOptions = [];
    newVariants.forEach((v) =>
      v.variantOptions.forEach((vo) => {
        vo.variantId = v.id;
        variantOptions.push(vo);
      }),
    );
    await this.variantOptionsRepository.save(variantOptions);
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
