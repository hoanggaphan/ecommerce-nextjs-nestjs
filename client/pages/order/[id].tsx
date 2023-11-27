import {
  Badge,
  Button,
  Card,
  Collapse,
  Container,
  Progress,
  Row,
  Text,
  User,
} from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AiOutlineReload } from 'react-icons/ai';
import { CgMenuBoxed } from 'react-icons/cg';
import { GiReceiveMoney } from 'react-icons/gi';
import { TbTruckDelivery } from 'react-icons/tb';
import UserLayout from '../../components/common/UserLayout';
import useAuth from '../../libs/hooks/useAuth';
import useMediaQuery from '../../libs/hooks/useMediaQuery';
import { useOrder } from '../../libs/swr/useOrder';

export default function Id() {
  useAuth(true);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { data: order } = useOrder({ id, token: session?.accessToken });

  const handleZaloPay = async () => {
    if (!order) return;

    try {
      const { data }: any = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/zalopay/create-order`,
        order,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (data.order_url) {
        window.open(data.order_url, '_self');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMomo = async () => {
    if (!order) return;

    try {
      const { data }: any = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/momo/create-order`,
        order,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (data.order_url) {
        window.open(data.order_url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePay = () => {
    if (!order) return;

    switch (order.paymentMethod) {
      case 'ZALOPAY':
        handleZaloPay();
        break;
      case 'MOMO':
        handleMomo();
        break;
    }
  };
  const isXs = useMediaQuery('(min-width: 650px)');

  return (
    <>
      <Head>
        <title>Đơn hàng {id}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Text
          h2
          size={isXs ? 50 : 30}
          css={{
            mt: 50,
            textAlign: 'center',
            textGradient: '45deg, $purple600 -20%, $pink600 100%',
          }}
          weight='bold'
        >
          CHI TIẾT ĐƠN HÀNG
        </Text>
        <Container xs>
          <Text
            css={{
              textAlign: 'center',
              backgroundColor: order?.isPaid ? '$green200' : '$red200',
              '& b': { color: order?.isPaid ? '$green800' : '$red800' },
            }}
            b
            blockquote
          >
            {order?.isPaid
              ? 'Đơn hàng đã thanh toán'
              : 'Đơn hàng chưa thanh toán'}
          </Text>

          <Card>
            <Card.Header>
              <OrderStepper />{' '}
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ padding: 20 }}>
              <Text size='$xl' css={{ mb: 5 }}>
                Mã đơn hàng: <Text b>15</Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Ngày đặt:{' '}
                <Text b>
                  {order?.createdDate &&
                    new Date(order?.createdDate).toLocaleString('vi-VN')}
                </Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Người nhận: <Text b>{order?.fullName}</Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Số điện thoại: <Text b>{order?.phone}</Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Giao đến: <Text b>{order?.address}</Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Phương thức thanh toán: <Text b>{order?.paymentMethod}</Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Trạng thái thanh toán:{' '}
                <Text b>
                  {order?.isPaid ? (
                    <Badge size='lg' isSquared color='success' variant='flat'>
                      Đã thanh toán
                    </Badge>
                  ) : (
                    <Badge size='lg' isSquared color='error' variant='flat'>
                      Chưa thanh toán
                    </Badge>
                  )}
                </Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Phí ship:{' '}
                <Text b>{order?.shippingCost.toLocaleString('vi-VN')} đ</Text>
              </Text>
              <Text size='$xl' css={{ mb: 5 }}>
                Tổng tiền:{' '}
                <Text b color='secondary'>
                  {order?.totalPrice.toLocaleString('vi-VN')} đ
                </Text>
              </Text>

              {!order?.isPaid &&
                order?.paymentMethod === 'ZALOPAY' &&
                (order.orderStatus === 'processing' ||
                  order.orderStatus === 'delivering') && (
                  <Button size='lg' css={{ mt: 20 }} onPress={handlePay}>
                    Thanh toán
                  </Button>
                )}
            </Card.Body>
          </Card>

          <Collapse.Group css={{ padding: 0, mt: 50 }}>
            <Collapse shadow title='Thông tin đơn hàng'>
              <table style={{ width: '100%' }}>
                <tbody>
                  {order?.orderItems.map((o) => (
                    <tr key={o.id}>
                      <td style={{ width: '320px' }}>
                        <User
                          squared
                          src={
                            o.variant.product &&
                            o.variant.product.images.length > 0
                              ? o.variant.product.images[0].url
                              : ''
                          }
                          name={o.variant.product?.name}
                          css={{
                            p: 0,
                            '& .nextui-user-info': {
                              whiteSpace: 'unset',
                              '& .nextui-user-name': {
                                maxWidth: '300px',
                              },
                            },
                          }}
                        >
                          <Row>
                            {o.variant.attributeValues.length > 0 &&
                              o.variant.attributeValues.map((i, index) => (
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
                      </td>
                      <td>
                        <Text css={{ textAlign: 'center' }}>
                          {o.orderedQuantity}
                        </Text>
                      </td>
                      <td>
                        {' '}
                        <Text css={{ textAlign: 'center' }}>
                          {o.orderedPrice.toLocaleString('vi-VN')} đ
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Collapse>
          </Collapse.Group>
        </Container>
      </UserLayout>
    </>
  );
}

const OrderStepper = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { data: order } = useOrder({ id, token: session?.accessToken });
  const isMatches = useMediaQuery('(max-width: 600px)');

  const getPercent = (status?: string) => {
    if (status === 'processing') return 33;
    if (status === 'delivering') return 66;
    if (status === 'delivered') return 100;
    return 0;
  };

  return (
    <>
      <div className='stepper-container'>
        <div className='stepper-item'>
          <div
            className='stepper-icon'
            style={{
              backgroundColor: '#BC8EE9',
              color: 'white',
            }}
          >
            <CgMenuBoxed size={isMatches ? 20 : 38} />
          </div>
          <Text
            css={{ textAlign: 'center', mt: 5, fontSize: isMatches ? 13 : 16 }}
          >
            Đơn hàng đã đặt
          </Text>
        </div>

        <div className='stepper-item'>
          <div
            className='stepper-icon'
            style={{
              backgroundColor:
                order?.orderStatus === 'processing' ||
                order?.orderStatus === 'delivering' ||
                order?.orderStatus === 'delivered'
                  ? '#BC8EE9'
                  : '#F1F3F5',
              color:
                order?.orderStatus === 'processing' ||
                order?.orderStatus === 'delivering' ||
                order?.orderStatus === 'delivered'
                  ? 'white'
                  : '#687076',
            }}
          >
            <AiOutlineReload size={isMatches ? 20 : 38} />
          </div>
          <Text
            css={{ textAlign: 'center', mt: 5, fontSize: isMatches ? 13 : 16 }}
          >
            Đang xử lý đơn
          </Text>
        </div>

        <div className='stepper-item'>
          <div
            className='stepper-icon'
            style={{
              backgroundColor:
                order?.orderStatus === 'delivering' ||
                order?.orderStatus === 'delivered'
                  ? '#BC8EE9'
                  : '#F1F3F5',
              color:
                order?.orderStatus === 'delivering' ||
                order?.orderStatus === 'delivered'
                  ? 'white'
                  : '#687076',
            }}
          >
            <TbTruckDelivery size={isMatches ? 20 : 38} />
          </div>
          <Text
            css={{ textAlign: 'center', mt: 5, fontSize: isMatches ? 13 : 16 }}
          >
            Đang vận chuyển
          </Text>
        </div>

        <div className='stepper-item'>
          <div
            className='stepper-icon'
            style={{
              backgroundColor:
                order?.orderStatus === 'delivered' ? '#BC8EE9' : '#F1F3F5',
              color: order?.orderStatus === 'delivered' ? 'white' : '#687076',
            }}
          >
            <GiReceiveMoney size={isMatches ? 20 : 38} />
          </div>
          <Text
            css={{ textAlign: 'center', mt: 5, fontSize: isMatches ? 13 : 16 }}
          >
            Đã giao hàng
          </Text>
        </div>

        <Progress
          css={{
            position: 'absolute',
            top: isMatches ? '20px' : '40px',
            '--nextui--progressColor': '#BC8EE9',
            margin: '0 auto',
            width: '80%',
            left: '10%',
          }}
          squared='true'
          size='xs'
          value={getPercent(order?.orderStatus)}
        />
      </div>

      <style jsx>{`
        .stepper-container {
          width: 100%;
          position: relative;

          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
        }
        .stepper-item {
          z-index: 1;
          flex: 1;
        }
        .stepper-icon {
          width: 80px;
          height: 80px;
          border-radius: 30px;
          margin: 0 auto;

          display: flex;
          justify-content: center;
          align-items: center;

          transition: all 0.3s;
        }

        @media screen and (max-width: 600px) {
          .stepper-icon {
            width: 40px;
            height: 40px;
            border-radius: 15px;
          }
        }
      `}</style>
    </>
  );
};
