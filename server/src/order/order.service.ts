import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.ordersRepository.save(createOrderDto);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const exist = await this.ordersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    return this.ordersRepository.save({ id, ...updateOrderDto });
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const exist = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    return exist;
  }

  async remove(id: number) {
    const exist = await this.ordersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    return this.ordersRepository.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
