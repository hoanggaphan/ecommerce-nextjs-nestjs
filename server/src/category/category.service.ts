import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const name = await this.categoriesRepository.findOneBy({
      name: createCategoryDto.name,
    });
    if (name) throw new BadRequestException('Name already exist');

    const slug = await this.categoriesRepository.findOneBy({
      slug: createCategoryDto.slug,
    });
    if (slug) throw new BadRequestException('Slug already exist');

    return this.categoriesRepository.save(createCategoryDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'Register success',
    }));
  }

  findAllForAdmin(): Promise<Category[]> {
    return this.categoriesRepository.find({});
  }

  findAllForUser(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: {
        isActive: true,
      },
    });
  }

  async findBySlugForUser(slug: string) {
    const exist = await this.categoriesRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!exist) {
      throw new NotFoundException('Category not found.');
    }
    return exist;
  }

  async findOne(id: number): Promise<Category> {
    const exist = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!exist) {
      throw new NotFoundException('Category not found.');
    }

    return exist;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const exist = await this.categoriesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Category not found.');
    }
    const name = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.name = :nameUpdate and category.name != :nameExist', {
        nameUpdate: updateCategoryDto.name,
        nameExist: exist.name,
      })
      .getOne();

    if (name) throw new BadRequestException('Name already exist');

    const slug = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.slug = :slugUpdate and category.slug != :slugExist', {
        slugUpdate: updateCategoryDto.slug,
        slugExist: exist.slug,
      })
      .getOne();
    if (slug) throw new BadRequestException('Slug already exist');

    return this.categoriesRepository
      .update(id, updateCategoryDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'Update success',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.categoriesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Category not found.');
    }

    return this.categoriesRepository.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
