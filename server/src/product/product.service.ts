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

    const { variants, noOptions, categoryId, ...product } = createProductDto;

    // Case 1: Product has not variants
    if (noOptions) {
      // Save product
      const createProduct = new Product();
      if (categoryId) {
        createProduct.category = await this.categoryService.findOne(categoryId);
      }
      createProduct.name = product.name;
      createProduct.slug = product.slug;
      createProduct.description = product.description;
      createProduct.previewImage = product.previewImage;
      const newProduct = await this.productsRepository.save(createProduct);

      // Save variants
      const variant = new Variant();
      variant.price = noOptions.price;
      variant.quantity = noOptions.quantity;
      variant.product = newProduct;

      await this.variantsRepository.save(variant);
      return this.findOne(newProduct.id);
    }

    // Case 2: Product has variants
    // Before action save variants, we must check all options are existing in DB
    variants.forEach(async (variant) => {
      variant.options.forEach(async (option) => {
        // Check option existing in DB
        await this.optionService.findOne(option.id);
      });
    });

    // Save product
    const createProduct = new Product();
    if (categoryId) {
      createProduct.category = await this.categoryService.findOne(categoryId);
    }
    createProduct.name = product.name;
    createProduct.slug = product.slug;
    createProduct.description = product.description;
    createProduct.previewImage = product.previewImage;
    const newProduct = await this.productsRepository.save(createProduct);

    // Save variants
    variants.forEach(async (item) => {
      const variant = new Variant();
      variant.price = item.price;
      variant.quantity = item.quantity;
      variant.product = newProduct;

      const newVariant = await this.variantsRepository.save(variant);

      // Check all options existing in DB
      item.options.forEach(async (option) => {
        const variantOption = new VariantOption();

        variantOption.optionId = option.id;
        variantOption.variantId = newVariant.id;
        variantOption.value = option.value;

        await this.variantOptionsRepository.save(variantOption);
      });
    });

    // return result
    return this.findOne(newProduct.id);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
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

    return this.productsRepository
      .update(id, updateProductDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'Update success',
      }))
      .catch((err) => console.log(err));
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
