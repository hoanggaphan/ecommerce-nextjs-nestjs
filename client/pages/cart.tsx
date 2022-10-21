import { Button, Image, Row, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
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
import { ProductType } from '../types';

const fetcher = (url: string, ids: number[]) => {
  return axios.post(url, ids).then((res) => res.data);
};

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

  // Track the product is still visible or not
  // If not -> update cart
  useEffect(() => {
    if (data) {
      const ids = data?.map((i) => i.id);
      dispatch(updateCart({ ids }));
    }
  }, [data]);

  const findAmountMemorized = useMemo(
    () => (productId: number) => {
      const amount = cart.find((c) => c.productId === productId)?.quantity;
      return amount || 0;
    },
    [cart]
  );

  const totalPriceMemorized = useMemo(
    () =>
      data?.reduce((prev: number, curr: ProductType) => {
        const amount = findAmountMemorized(curr.id);
        return prev + amount * curr.price;
      }, 0),
    [cart, data]
  );

  const handleIncreaseAmount = (productId: number) => {
    const amount = findAmountMemorized(productId);
    if (amount >= 3) return;
    dispatch(increaseAmount({ productId }));
  };

  const handleDecreaseAmount = (productId: number) => {
    const amount = findAmountMemorized(productId);
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

  return (
    <>
      <Head>
        <title>Giỏ hàng</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <div className='wrapper'>
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
              {data?.map((item) => (
                <div key={item.id}>
                  <div className='product'>
                    <div className='productDetail'>
                      <Image
                        onClick={() => router.push(`/${item.slug}`)}
                        src={item.images[0].url}
                        width={200}
                        height={200}
                        objectFit='cover'
                        css={{ cursor: 'pointer' }}
                      />
                      <div className='details'>
                        <Text>
                          <b>Sản phẩm:</b> {item.name}
                        </Text>
                        <Spacer y={1} />
                        <Text>
                          <b>ID:</b> {item.id}
                        </Text>
                        {item.attributeValues.length > 0 && (
                          <>
                            <Spacer y={1} />
                            <Row css={{ columnGap: 20 }}>
                              {item.attributeValues.map((i) => (
                                <Text key={i.id + i.value}>
                                  <b>{i.attribute.name}:</b> {i.value}
                                </Text>
                              ))}
                            </Row>
                          </>
                        )}

                        <Spacer y={1} />
                        <Text>
                          <Text b>Đơn giá: </Text>
                          <Text as='span'>
                            {item.price.toLocaleString('vi-VN')} đ
                          </Text>
                        </Text>
                        <Spacer y={1} />
                        <Text>
                          <Text b>Tổng: </Text>
                          <Text b color='secondary'>
                            {(
                              item.price * findAmountMemorized(item.id)
                            ).toLocaleString('vi-VN')}{' '}
                            đ
                          </Text>
                        </Text>
                      </div>
                    </div>
                    <div className='productDetail'>
                      <div className='productAmountContainer '>
                        <Button
                          onPress={() => handleDecreaseAmount(item.id)}
                          color='secondary'
                          auto
                          flat
                          icon={<MdRemove fill='currentColor' size={24} />}
                        />
                        <div className='amount'>
                          {findAmountMemorized(item.id)}
                        </div>
                        <Button
                          onPress={() => handleIncreaseAmount(item.id)}
                          color='secondary'
                          auto
                          flat
                          icon={<MdAdd fill='currentColor' size={24} />}
                        />
                      </div>
                    </div>

                    <div className='close'>
                      <AiOutlineClose
                        size={20}
                        onClick={() => handleCartRemoveItem(item.id)}
                      />
                    </div>
                  </div>
                  <hr className='hr' />
                </div>
              ))}
            </div>
            <div className='summary'>
              <Text
                h2
                color='secondary'
                weight='normal'
                css={{ textAlign: 'center' }}
              >
                TỔNG ĐƠN HÀNG
              </Text>
              <div className='summaryItem'>
                <Text>Phí vận chuyển</Text>
                <Text b color='secondary'>
                  {0} đ
                </Text>
              </div>
              <div className='summaryItem'>
                <Text>Tổng cộng</Text>
                <Text b color='secondary'>
                  {totalPriceMemorized?.toLocaleString('vi-VN')} đ
                </Text>
              </div>
              <Row
                css={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 5,
                  paddingTop: 25,
                }}
              >
                <Button size='lg' color='secondary'>
                  THANH TOÁN NGAY
                </Button>
                <Button
                  onPress={() => router.push('/')}
                  size='lg'
                  bordered
                  color='secondary'
                >
                  TIẾP TỤC MUA SẮM
                </Button>
              </Row>
            </div>
          </div>
        </div>
      </UserLayout>
      <style jsx>{`
        .amount {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #7828c8;
          color: #7828c8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0px 5px;
        }

        .wrapper {
          padding: 20px;
        }

        .topText {
          font-weight: bold;
          font-size: 20px;
          margin: 0px 10px;
        }

        .bottom {
          display: flex;
          column-gap: 30px;
          justify-content: space-between;
        }

        .info {
          flex: 3;
        }

        .product {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding-top: 10px;
          padding-bottom: 10px;
        }

        .productDetail {
          display: flex;
        }

        .image {
          width: 200px;
        }

        .details {
          padding: 20px;
        }

        .priceDetail {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .productAmountContainer {
          display: flex;
          align-items: center;
        }

        .productAmount {
          font-size: 24px;
          margin: 5px;
        }

        .productPrice {
          font-size: 30px;
          font-weight: 200;
        }

        .hr {
          background-color: #eee;
          border: none;
          height: 1px;
        }

        .summary {
          flex: 1;
          border: 0.5px solid lightgray;
          border-radius: 10px;
          padding: 20px;
          max-height: 400px;
        }

        .summaryTitle {
          font-weight: 200;
        }

        .summaryItem {
          margin: 30px 0px;
          display: flex;
          justify-content: space-between;
        }

        .close {
          position: absolute;
          right: 0;
        }
      `}</style>
    </>
  );
}
