import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { firstValueFrom } from 'rxjs';
import { Like, Raw, Repository } from 'typeorm';
import { OrderStatus } from './../enums/orderStatus.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepo: Repository<OrderItem>,
    private readonly httpService: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { orderItems } = createOrderDto;
    const order = await this.ordersRepo.save(createOrderDto);

    const newOrderItems = orderItems.map((o) => ({ ...o, orderId: order.id }));
    await this.orderItemsRepo.save(newOrderItems);
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const exist = await this.ordersRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    const { orderItems } = updateOrderDto;
    await this.orderItemsRepo.save(orderItems);
    return this.ordersRepo.save({ id, ...updateOrderDto });
  }

  async updateOrderStatus(id: number, updateOrderStatus: UpdateOrderStatusDto) {
    const exist = await this.ordersRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    return this.ordersRepo.update(id, { ...updateOrderStatus });
  }

  async findAll(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<Order>> {
    return paginate<Order>(this.ordersRepo, options, {
      where: [
        {
          id: Raw((alias) => `CAST(${alias} as char(20)) Like '%${name}%'`), // Ép id kiểu int thành string, tìm kiếm gần giống
        },
        {
          fullName: Like(`%${name}%`),
        },
        {
          user: {
            username: Like(`%${name}%`),
          },
        },
      ],
      relations: {
        orderItems: true,
        user: true,
      },
      order: {
        updatedDate: 'DESC',
      },
    });
  }

  async findUserOrders(
    options: IPaginationOptions,
    type: number,
    userId: number,
  ): Promise<Pagination<Order>> {
    let orderStatus = null;
    switch (type) {
      case 1:
        orderStatus = OrderStatus.Processing;
        break;
      case 2:
        orderStatus = OrderStatus.Delivering;
        break;
      case 3:
        orderStatus = OrderStatus.Delivered;
        break;
      case 4:
        orderStatus = OrderStatus.Cancel;
        break;
      case 5:
        orderStatus = OrderStatus.Return;
        break;
      case 6:
        orderStatus = OrderStatus.Refund;
        break;
    }

    return paginate<Order>(this.ordersRepo, options, {
      where: {
        user: {
          id: userId,
        },
        orderStatus,
      },
      relations: {
        orderItems: {
          variant: {
            product: true,
            attributeValues: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const exist = await this.ordersRepo.findOne({
      where: { id },
      relations: {
        user: true,
        orderItems: {
          variant: {
            product: {
              images: true,
            },
            attributeValues: true,
          },
        },
      },
    });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    delete exist.user.password;

    return exist;
  }

  async remove(id: number) {
    const exist = await this.ordersRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    return this.ordersRepo.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }

  async calculateTotalRevenue() {
    return await this.ordersRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'totalRevenue')
      .where('order.isPaid = true')
      .getRawOne();
  }

  async salesStatistic(year: string) {
    // Select paymentMethod as method, SUM(totalPrice) as total
    // from Order
    // where isPaid = true and paidDate IS NOT NULL and YEAR(paidDate) = @year
    // group by paymentMethod

    return this.ordersRepo
      .createQueryBuilder('order')
      .select('paymentMethod', 'method')
      .addSelect('MONTH(paidDate)', 'month')
      .addSelect('SUM(totalPrice)', 'total')
      .where(
        `isPaid = true and paidDate IS NOT NULL and YEAR(paidDate) = ${year}`,
      )
      .groupBy('paymentMethod, MONTH(paidDate)')
      .getRawMany();
  }

  async count() {
    return await this.ordersRepo.count();
  }

  async overview() {
    return await this.ordersRepo
      .createQueryBuilder('order')
      .select('orderStatus')
      .addSelect('COUNT(order.id)', 'total')
      .groupBy('orderStatus')
      .getRawMany();
  }

  async createZaloPayOrder(order) {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = String(new Date(Date.now()).getMonth() + 1).padStart(2, '0');
    const dd = String(new Date(Date.now()).getUTCDate()).padStart(2, '0');

    const items = order.orderItems.map((o) => {
      let attributes = '';

      for (const [i, at] of o.variant.attributeValues.entries() as any) {
        attributes += i === 0 ? ' - ' : ', ';
        attributes += `${at.value}`;
      }

      const itemname = o.variant.product?.name + attributes;

      return {
        itemid: o.id,
        itemname,
        itemprice: o.orderedPrice,
        itemquantity: o.orderedQuantity,
      };
    });

    const server_uri =
      process.env.NODE_ENV === 'development'
        ? 'https://57c4-101-99-32-135.ap.ngrok.io'
        : process.env.SERVER;
    // ngrok http --host-header=localhost http://localhost:4000
    const callback_url = `${server_uri}/order/zalopay/callback`;

    const params = {
      app_id: 2553,
      app_user: order.fullName,
      app_trans_id: `${yy}${mm}${dd}_${order.id}_${Date.now()}`,
      embed_data: JSON.stringify({
        redirecturl: `${process.env.CLIENT}/order/${order.id}`,
        orderId: order.id,
      }),
      amount: 50000,
      item: JSON.stringify(items),
      app_time: Date.now(),
      bank_code: 'zalopayapp',
      phone: order.phone.toString(),
      address: order.address,
      description: `Thanh toán đơn hàng ${order.id}`,
      mac: '',
      callback_url,
    };

    const data =
      params.app_id +
      '|' +
      params.app_trans_id +
      '|' +
      params.app_user +
      '|' +
      params.amount +
      '|' +
      params.app_time +
      '|' +
      params.embed_data +
      '|' +
      params.item;

    const key1 = process.env.ZALO_KEY1;

    // const mac = CryptoJS.HmacSHA256(data, key1).toString();
    const mac = createHmac('sha256', key1).update(data).digest('hex');
    params.mac = mac;

    try {
      return (
        await firstValueFrom(
          this.httpService.post('https://sb-openapi.zalopay.vn/v2/create', {
            ...params,
          }),
        )
      ).data;
    } catch (error) {
      // console.log(error);
      throw new InternalServerErrorException('ZaloPay Error');
    }
  }

  async checkOrderUser(data) {
    const exist = await this.ordersRepo.findOne({
      where: { id: data.orderId, user: { id: data.userId } },
    });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    return exist;
  }

  // async createMomoOrder(order) {
  //   const yy = new Date().getFullYear().toString().slice(-2);
  //   const mm = String(new Date(Date.now()).getMonth() + 1).padStart(2, '0');
  //   const dd = String(new Date(Date.now()).getUTCDate()).padStart(2, '0');

  //   const items = order.orderItems.map((o) => {
  //     let attributes = '';

  //     for (const [i, at] of o.variant.attributeValues.entries() as any) {
  //       attributes += i === 0 ? ' - ' : ', ';
  //       attributes += `${at.value}`;
  //     }

  //     const itemname = o.variant.product?.name + attributes;

  //     return {
  //       itemid: o.id,
  //       itemname,
  //       itemprice: o.orderedPrice,
  //       itemquantity: o.orderedQuantity,
  //     };
  //   });

  //   const endpoint =
  //     'https://test-payment.momo.vn/gw_payment/transactionProcessor';
  //   const partnerCode = 'MOMOOJOI20210710';
  //   const accessKey = 'iPXneGmrJH0G8FOP';
  //   const serectkey = 'sFcbSGRSJjwGxwhhcEktCHWYUuTuPNDB';
  //   const orderInfo = 'test';
  //   const ipnUrl = 'http://localhost:4000/momo/callback';
  //   const notifyurl =
  //     'https://4c8d-2001-ee0-5045-50-58c1-b2ec-3123-740d.ap.ngrok.io/Home/SavePayment'; //lưu ý: notifyurl không được sử dụng localhost, có thể sử dụng ngrok để public localhost trong quá trình test

  //   const amount = '1000';
  //   const orderid = Date.now(); //mã đơn hàng
  //   const requestId = Date.now();
  //   const extraData = '';
  //   const requestType = 'captureWallet';
  //   const redirectUrl = '';

  //   //Before sign HMAC SHA256 signature
  //   const rawHash =
  //     '&accessKey=' +
  //     accessKey +
  //     '&amount=' +
  //     amount +
  //     '&extraData=' +
  //     extraData +
  //     '&ipnUrl=' +
  //     ipnUrl +
  //     '&orderId=' +
  //     orderid +
  //     '&orderInfo=' +
  //     orderInfo +
  //     'partnerCode=' +
  //     partnerCode +
  //     'redirectUrl=' +
  //     redirectUrl +
  //     '&requestId=' +
  //     requestId +
  //     '&requestType=' +
  //     requestType;

  //   //sign signature SHA256
  //   const signature = createHmac('sha256', serectkey)
  //     .update(rawHash)
  //     .digest('hex');

  //   const data = {
  //     partnerCode: partnerCode,
  //     accessKey: accessKey,
  //     requestId: requestId,
  //     amount: amount,
  //     orderId: orderid,
  //     orderInfo: orderInfo,
  //     ipnUrl: ipnUrl,
  //     notifyUrl: notifyurl,
  //     extraData: extraData,
  //     requestType: 'captureMoMoWall',
  //     signature: signature,
  //   };

  //   try {
  //     return (await firstValueFrom(this.httpService.post(endpoint, data))).data;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException('Momo Error');
  //   }
  // }
}
