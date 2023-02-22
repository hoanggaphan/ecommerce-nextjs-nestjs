import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Like, Raw, Repository } from 'typeorm';
import { Role } from './../enums/role.enum';
import { CreateEmployeeDto } from './dto/create-employee';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exist = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });
    if (exist) throw new BadRequestException('username already exist');

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    createUserDto.password = hashedPassword;

    return this.usersRepository.save(createUserDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'Register success',
    }));
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const exist = await this.usersRepository.findOneBy({
      username: createEmployeeDto.username,
    });
    if (exist) throw new BadRequestException('username already exist');

    const hashedPassword = await bcrypt.hash(
      createEmployeeDto.password,
      saltOrRounds,
    );
    createEmployeeDto.password = hashedPassword;

    return this.usersRepository.save(createEmployeeDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'Register success',
    }));
  }

  async findAllForAdmin(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .where([
        {
          id: Raw((alias) => `CAST(${alias} as char(20)) Like '%${name}%'`), // Ép id kiểu int thành string, tìm kiếm gần giống
        },
        {
          username: Like(`%${name}%`),
        },
      ])
      .andWhere(':role1 IN(user.roles) or :role2 IN(user.roles)', {
        role1: Role.Manager,
        role2: Role.Employee,
      })
      .orderBy('user.updatedDate', 'DESC'); // Or whatever you need to do

    return paginate<User>(queryBuilder, options);
  }

  async findOne(id: number): Promise<User> {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return exist;
  }

  async findByName(username: string): Promise<User> {
    const exist = await this.usersRepository.findOneBy({ username });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return exist;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return this.usersRepository.update(id, updateUserDto).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Update success',
    }));
  }

  async updateAccount(id: number, updateAccountDto: UpdateAccountDto) {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    const hashedPassword = await bcrypt.hash(
      updateAccountDto.password,
      saltOrRounds,
    );
    updateAccountDto.password = hashedPassword;

    return this.usersRepository.update(id, updateAccountDto).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Update success',
    }));
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne(updatePasswordDto.userId);
    const result = await bcrypt.compare(
      updatePasswordDto.oldPass,
      user.password,
    );
    if (!result) {
      throw new BadRequestException('Password not exactly');
    }

    if (updatePasswordDto.newPass !== updatePasswordDto.confirmPass) {
      throw new BadRequestException('Confirm password not equal new password');
    }

    const hashedPassword = await bcrypt.hash(
      updatePasswordDto.newPass,
      saltOrRounds,
    );

    return this.usersRepository
      .update(updatePasswordDto.userId, { password: hashedPassword })
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'Update password success',
      }));
  }

  async remove(id: number) {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return this.usersRepository.delete(id).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
