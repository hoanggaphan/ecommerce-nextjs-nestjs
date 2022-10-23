import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Text,
  Tooltip,
  User,
} from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdAdd, MdRemove } from 'react-icons/md';
import Swal from 'sweetalert2';
import useSWR from 'swr';
import UserLayout from '../components/common/UserLayout';
import { server } from '../libs/constants';
import {
  decreaseAmount,
  increaseAmount,
  removeItemFromCart,
  selectCart,
  selectTotalAmount,
  updateCart,
} from '../libs/redux/reducers/cartReducer';
import { useAppDispatch, useAppSelector } from '../libs/redux/store';
import { CartItemType, ProductType } from '../types';
import { IconButton } from './admin/category';

type CustomCartItemType = ProductType & {
  amountInCart: number;
};

const fetcher = (url: string, ids: number[]) => {
  return axios.post(url, ids).then((res) => res.data);
};

const columns = [
  { name: 'Sản phẩm', uid: 'product' },
  { name: 'Đơn giá', uid: 'price' },
  { name: 'Số lượng', uid: 'amount' },
  { name: 'Tổng', uid: 'total' },
  { name: 'hành động', uid: 'actions' },
];

const findAmount = (productId: number, cart: CartItemType[]) => {
  const amount = cart.find((c) => c.productId === productId)?.quantity;
  return amount || 0;
};

const totalPrice = (cart: CustomCartItemType[]) =>
  cart?.reduce((prev: number, curr: CustomCartItemType) => {
    return prev + curr.amountInCart * curr.price;
  }, 0);

export default function Cart() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const totalAmount = useAppSelector(selectTotalAmount);
  const ids = cart.map((i: any) => i.productId);
  const { data } = useSWR<ProductType[]>(
    ids.length ? [`${server}/product/cart-items`, ids] : null,
    fetcher
  );
  const { data: session } = useSession();

  const cartItems: CustomCartItemType[] = useMemo(() => {
    const items = data?.map((d) => {
      const amountInCart = findAmount(d.id, cart);
      return { amountInCart, ...d };
    });

    return items || [];
  }, [data, cart]);

  // Track the product is still visible or not
  // If not -> update cart
  useEffect(() => {
    if (data) {
      const ids = data?.map((i) => i.id);
      dispatch(updateCart({ ids }));
    }
  }, [data]);

  const handleIncreaseAmount = (productId: number) => {
    const amount = findAmount(productId, cart);
    if (amount >= 3) return;
    dispatch(increaseAmount({ productId }));
  };

  const handleDecreaseAmount = (productId: number) => {
    const amount = findAmount(productId, cart);
    if (amount <= 1) return;
    dispatch(decreaseAmount({ productId }));
  };

  const handleCartRemoveItem = (productId: number) => {
    Swal.fire({
      title: 'Bạn có chắc?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa!',
      cancelButtonText: 'Đóng',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeItemFromCart({ productId }));
      }
    });
  };

  const handlePay = () => {
    if (!session) {
      router.push({
        pathname: '/auth/login',
        query: { name: '/checkout' },
      });
    } else {
      router.push('/checkout');
    }
  };

  const renderCell = (product: CustomCartItemType, columnKey: React.Key) => {
    switch (columnKey) {
      case 'product':
        return (
          <User
            squared
            src={product.images.length > 0 ? product.images[0].url : ''}
            name={product.name}
            css={{ p: 0 }}
          >
            {product.attributeValues.length > 0 && (
              <>
                <Row>
                  {product.attributeValues.map((i, index) => (
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
              </>
            )}
          </User>
        );

      case 'price':
        return (
          <Text b size={13} css={{ tt: 'capitalize', color: '$accents7' }}>
            {product.price.toLocaleString('vi-VN')}
          </Text>
        );

      case 'amount':
        return (
          <Row align='center'>
            <div
              onClick={() => handleDecreaseAmount(product.id)}
              style={{
                width: 27,
                height: 27,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #f5f5f5',
                color: '#666',
              }}
            >
              <MdRemove fill='currentColor' size={20} />
            </div>
            <div
              style={{
                width: 38,
                height: 27,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderTop: '1px solid #f5f5f5',
                borderBottom: '1px solid #f5f5f5',
                color: '#666',
              }}
            >
              {product.amountInCart}
            </div>
            <div
              onClick={() => handleIncreaseAmount(product.id)}
              style={{
                width: 27,
                height: 27,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #f5f5f5',
                color: '#666',
              }}
            >
              <MdAdd fill='currentColor' size={20} />
            </div>
          </Row>
        );

      case 'total':
        return (
          <Text b size={14} color='secondary'>
            {(product.price * product.amountInCart).toLocaleString('vi-VN')} đ
          </Text>
        );

      default:
        return (
          <Row justify='center' align='center'>
            <Col css={{ d: 'flex' }}>
              <Tooltip
                content='Xóa'
                color='error'
                onClick={() => handleCartRemoveItem(product.id)}
              >
                <IconButton>
                  <AiOutlineDelete size={20} fill='#FF0080' />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Giỏ hàng</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Container md>
          <Text
            h2
            size={50}
            css={{
              textAlign: 'center',
              textGradient: '45deg, $purple600 -20%, $pink600 100%',
            }}
            weight='bold'
          >
            GIỎ HÀNG
          </Text>
          <Row justify='center'>
            <Text h4 color='secondary' weight='normal'>
              TỔNG SỐ LƯỢNG | {totalAmount} SẢN PHẨM
            </Text>
          </Row>

          <div className='bottom'>
            <div className='info'>
              <Table
                aria-label='Products cart table'
                css={{
                  height: 'auto',
                  minWidth: '100%',
                }}
                selectionMode='none'
              >
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Column
                      key={column.uid}
                      hideHeader={column.uid === 'actions'}
                      align={column.uid === 'actions' ? 'center' : 'start'}
                    >
                      {column.name}
                    </Table.Column>
                  )}
                </Table.Header>
                <Table.Body items={cartItems}>
                  {(item: CustomCartItemType) => (
                    <Table.Row>
                      {(columnKey) => (
                        <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                      )}
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>
            <div className='summary'>
              <Card>
                <Card.Body>
                  <Row justify='space-between'>
                    <Text size={20} b css={{ color: '$accents9' }}>
                      Tổng:
                    </Text>
                    <Text size={20} b color='secondary'>
                      {totalPrice(cartItems)?.toLocaleString('vi-VN')} đ
                    </Text>
                  </Row>
                  <Row
                    css={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 5,
                      paddingTop: 25,
                      borderTop: '1px solid rbga(0,0,0,.2)',
                    }}
                  >
                    <Button
                      onPress={handlePay}
                      shadow
                      size='lg'
                      color='secondary'
                    >
                      THANH TOÁN NGAY
                    </Button>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </UserLayout>
      <style jsx>{`
        .bottom {
          display: flex;
          column-gap: 30px;
          justify-content: space-between;
          align-items: flex-start;
        }

        .info {
          flex: 3;
        }

        .summary {
          flex: 1;
        }
      `}</style>
    </>
  );
}
