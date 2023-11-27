import {
  Badge,
  Button,
  Card,
  Grid,
  Row,
  Spacer,
  Table,
  Text,
  User,
} from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillPrinter } from 'react-icons/ai';
import { BsCreditCardFill } from 'react-icons/bs';
import { FaUserAstronaut } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Select from 'react-select';
import AdminLayout from '../../../components/common/AdminLayout';
import useAuth from '../../../libs/hooks/useAuth';
import { useOrder } from '../../../libs/swr/useOrder';
import { OrderItemType } from '../../../types';

const columns = [
  { name: 'Sản phẩm', uid: 'product' },
  { name: 'Đơn giá', uid: 'price' },
  { name: 'Số lượng', uid: 'quantity' },
  { name: 'Tổng', uid: 'total' },
];

const options = [
  { label: 'đang xử lý', value: 'processing' },
  { label: 'đang vận chuyển', value: 'delivering' },
  { label: 'đã giao hàng', value: 'delivered' },
  { label: 'hoàn tiền', value: 'refund' },
  { label: 'trả lại', value: 'return' },
  { label: 'hủy', value: 'cancel' },
];
type OptionType = {
  label: string;
  value: string;
};

export default function Index() {
  useAuth(true);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { data: order, mutate } = useOrder({ id, token: session?.accessToken });
  const [selected, setSelected] = useState<OptionType | null>(null);

  const handleSelect = async (newValue: OptionType | null) => {
    setSelected(newValue);

    if (order?.paymentMethod === 'COD') {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/order/update-status/${order?.id}`,
        {
          orderStatus: newValue?.value,
          isPaid: newValue?.value === 'delivered' ? true : false,
          paidDate:
            newValue?.value === 'delivered' ? new Date().toISOString() : null,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
    } else {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/order/update-status/${order?.id}`,
        {
          orderStatus: newValue?.value,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
    }

    await mutate();
  };

  const handleShipped = async () => {
    if (order?.paymentMethod === 'COD') {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/order/update-status/${order?.id}`,
        {
          orderStatus: 'delivered',
          isPaid: true,
          paidDate: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
    } else {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/order/update-status/${order?.id}`,
        {
          orderStatus: 'delivered',
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
    }

    await mutate();
  };

  useEffect(() => {
    if (order) {
      const res = options.find((o) => o.value === order.orderStatus);
      res ? setSelected(res) : setSelected(null);
    }
  }, [order]);

  const renderCell = (orderItem: OrderItemType, columnKey: React.Key) => {
    switch (columnKey) {
      case 'product':
        return (
          <User
            squared
            src={
              orderItem.variant.product &&
              orderItem.variant.product.images.length > 0
                ? orderItem.variant.product.images[0].url
                : ''
            }
            name={orderItem.variant.product?.name}
            css={{ p: 0 }}
          >
            <Row>
              {orderItem.variant.attributeValues.length > 0 &&
                orderItem.variant.attributeValues.map((i, index) => (
                  <Text
                    key={i.id + i.value}
                    b
                    size={13}
                    css={{ tt: 'capitalize', color: '$accents7' }}
                  >
                    {(index ? ', ' : '') + i.value}
                  </Text>
                ))}
            </Row>
          </User>
        );

      case 'price':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {orderItem.orderedPrice.toLocaleString('vi-VN')}
          </Text>
        );

      case 'quantity':
        return (
          <Text b size={13} css={{ tt: 'capitalize', color: '$accents7' }}>
            {orderItem.orderedQuantity}
          </Text>
        );

      case 'total':
        return (
          <Text b size={13} css={{ tt: 'capitalize', color: '$accents7' }}>
            {(
              orderItem.orderedQuantity * orderItem.orderedPrice
            ).toLocaleString('vi-VN')}
          </Text>
        );
    }
  };

  return (
    <>
      {' '}
      <Head>
        <title>Chi tiết đơn hàng</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminLayout title='Chi tiết đơn hàng'>
        <Card>
          <Card.Header>
            <Row justify='space-between'>
              <div>
                <Text b>Mã đơn hàng: #{id}</Text>
                <Text color='$accents7'>
                  {order && new Date(order.createdDate).toLocaleString('vi-VN')}
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 200,
                  }}
                >
                  <Select
                    value={selected}
                    onChange={handleSelect}
                    placeholder='Đổi trạng thái'
                    options={options}
                    menuPortalTarget={document.body}
                    menuPosition={'fixed'}
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: '100%',
                      }),
                      control: (base) => ({
                        ...base,
                        background: '#F1F3F5',
                        border: 'none',
                        borderColor: 'none',
                        borderRadius: 12,
                        minHeight: 40,
                        boxShadow: 'none',
                      }),
                      menu: (base) => ({
                        ...base,
                        background: '#fff',
                        fontSize: 14,
                        borderRadius: 12,
                        overflow: 'hidden',
                      }),
                      menuList: (base) => ({
                        ...base,
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        fontSize: 14,
                      }),
                      option: (styles: any, { isSelected }: any) => ({
                        ...styles,
                        backgroundColor: isSelected ? '#7828C8' : null,
                        color: isSelected ? 'white' : null,
                        ':hover': {
                          backgroundColor: isSelected ? null : '#EADCF8',
                          color: isSelected ? null : '#7828C8',
                        },
                        ':active': {
                          backgroundColor: null,
                          color: null,
                        },
                      }),
                    }}
                  />
                </div>
                <Button
                  auto
                  color='secondary'
                  animated={false}
                  icon={<AiFillPrinter size={20} />}
                />
              </div>
            </Row>
          </Card.Header>
          <Card.Divider />
          <Card.Body>
            <Row>
              <Row css={{ columnGap: 10 }}>
                <FaUserAstronaut size={40} fill='#7828C8' />
                <div>
                  <Text b>Khách hàng</Text>
                  <Text css={{ color: '$accents7' }}>{order?.fullName}</Text>
                  <Text css={{ color: '$accents7' }}>{order?.phone}</Text>
                </div>
              </Row>
              <Row css={{ columnGap: 10 }}>
                <BsCreditCardFill size={40} fill='#7828C8' />
                <div>
                  <Text b>Phương thức thanh toán</Text>
                  <Text css={{ color: '$accents7' }}>
                    {order?.paymentMethod}
                  </Text>
                </div>
              </Row>
              <Row css={{ columnGap: 10 }}>
                <MdLocationOn size={40} fill='#7828C8' />
                <div>
                  <Text b>Giao hàng đến</Text>
                  <Text css={{ color: '$accents7' }}>{order?.address}</Text>
                </div>
              </Row>
            </Row>
            <Spacer y={2} />
            <Grid.Container css={{ columnGap: 15 }} wrap='nowrap'>
              <Grid xs={9}>
                <div className='w100'>
                  <Table
                    aria-label='Order items table'
                    css={{
                      height: 'auto',
                      minWidth: '100%',
                    }}
                    color='secondary'
                    bordered
                    shadow={false}
                  >
                    <Table.Header columns={columns}>
                      {(column) => (
                        <Table.Column key={column.uid}>
                          {column.name}
                        </Table.Column>
                      )}
                    </Table.Header>
                    <Table.Body items={order?.orderItems || []}>
                      {(item: OrderItemType) => (
                        <Table.Row>
                          {(columnKey) => (
                            <Table.Cell>
                              {renderCell(item, columnKey)}
                            </Table.Cell>
                          )}
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>

                  <Spacer y={0.5} />

                  <Row justify='flex-end'>
                    <div style={{ width: 200 }}>
                      <Row justify='space-between'>
                        <Text>Phí ship:</Text>
                        <Text>
                          {order?.shippingCost.toLocaleString('vi-VN')} đ
                        </Text>
                      </Row>
                      <Row justify='space-between'>
                        <Text>Tổng:</Text>
                        <Text b size={18} color='secondary'>
                          {order?.totalPrice.toLocaleString('vi-VN')} đ
                        </Text>
                      </Row>
                      <Row justify='space-between'>
                        <Text>Thanh toán:</Text>
                        <Badge
                          isSquared
                          variant='flat'
                          color={order?.isPaid ? 'success' : 'error'}
                        >
                          {order?.isPaid ? 'đã thanh toán' : 'chưa thanh toán'}
                        </Badge>
                      </Row>
                    </div>
                  </Row>
                </div>
              </Grid>
              <Grid xs={3}>
                {order?.orderStatus === 'delivered' ? (
                  <Button
                    animated={false}
                    css={{
                      background: '#17C964!important',
                      color: '#fff!important',
                    }}
                  >
                    Đã giao hàng
                  </Button>
                ) : (
                  <Button onPress={handleShipped} color='secondary' shadow>
                    Đánh dấu đã giao hàng
                  </Button>
                )}
              </Grid>
            </Grid.Container>
          </Card.Body>
        </Card>
      </AdminLayout>
    </>
  );
}
