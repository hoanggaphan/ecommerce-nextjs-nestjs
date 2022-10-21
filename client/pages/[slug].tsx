import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';
import UserLayout from '../components/common/UserLayout';
import { useProduct } from '../libs/swr/useProduct';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import Swal from 'sweetalert2';
import { FreeMode, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { addItemToCart, selectCart } from '../libs/redux/reducers/cartReducer';
import { useAppDispatch, useAppSelector } from '../libs/redux/store';

export default function Product() {
  const router = useRouter();
  const { slug } = router.query;
  const { data: product, error, isValidating, mutate } = useProduct({ slug });
  const [amount, setAmount] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);

  // If Product not found, redirect user
  if (
    error &&
    (error.response.status === 400 || error.response.status === 404)
  ) {
    mutate(() => undefined, { revalidate: false });
    router.push('/');
  }

  const handleCartAddItem = () => {
    if (!product) return;

    // If the current product is not in the cart
    const currentProduct = cart.find((i) => i.productId === product.id);
    if (!currentProduct) {
      const newItem = {
        productId: product.id,
        quantity: amount,
      };

      dispatch(addItemToCart(newItem));
      return;
    }

    // If product is in the cart
    // amount > 3, throw error
    if (currentProduct.quantity + amount > 3) {
      Swal.fire({
        title: 'Không thêm được vào giỏ hàng!',
        text: 'Số lượng sản phẩm này trong giỏ quá lớn',
        icon: 'error',
      });
      return;
    }

    const newItem = {
      productId: product.id,
      quantity: amount,
    };

    dispatch(addItemToCart(newItem));
  };

  return (
    <>
      <Head>
        <title>{product?.name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        {product ? (
          <Container md css={{ pt: 80 }}>
            <Row>
              <Col span={6}>
                <div style={{ maxWidth: 400, margin: '0 auto' }}>
                  <Swiper
                    spaceBetween={10}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    modules={[FreeMode, Thumbs]}
                    className='mySwiper2'
                  >
                    {product.images.map((i) => (
                      <SwiperSlide key={i.id}>
                        <Image src={i.url} alt='' />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={15}
                    slidesPerView={3}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    className='mySwiper'
                    style={{ marginTop: 35 }}
                  >
                    {product.images.map((i, index) => (
                      <SwiperSlide
                        key={i.id}
                        style={{
                          border: '2px solid rgba(0,0,0,.2)',
                          borderRadius: 5,
                        }}
                      >
                        <Image src={i.url} alt='' />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </Col>
              <Spacer y={2} />
              <Col span={6}>
                <Text h2>{product.name}</Text>
                <Row>
                  {product.attributeValues.map((i) => (
                    <Col key={i.id}>
                      <Text size='$xl'>
                        {i.attribute.name.toUpperCase()}:{' '}
                        {i.value.toUpperCase()}
                      </Text>
                    </Col>
                  ))}
                </Row>
                <Spacer y={1} />
                <Card.Divider />
                <Spacer y={1} />
                <Row>
                  <Text size='$3xl'>Giá: &nbsp;</Text>
                  <Text h2 color='secondary' css={{ mb: 0 }}>
                    {product.price.toLocaleString('vi-VN')} đ
                  </Text>
                </Row>
                <Spacer y={2} />
                <Row>
                  <div className='amountContainer'>
                    <Button
                      onPress={() => amount > 1 && setAmount(amount - 1)}
                      color='secondary'
                      auto
                      flat
                      icon={<MdRemove fill='currentColor' size={24} />}
                    />
                    <div className='amount'>{amount}</div>
                    <Button
                      onPress={() => amount < 3 && setAmount(amount + 1)}
                      color='secondary'
                      auto
                      flat
                      icon={<MdAdd fill='currentColor' size={24} />}
                    />
                  </div>
                  <Spacer x={2} />
                  <Button
                    onPress={handleCartAddItem}
                    shadow
                    color='secondary'
                    auto
                  >
                    Thêm vào giỏ
                  </Button>
                </Row>
              </Col>
            </Row>
            <Spacer y={4} />
            <Text h2>Mô tả</Text>
            <Row>{product.description}</Row>
          </Container>
        ) : (
          'Loading...'
        )}
        <style jsx>{`
          .amountContainer {
            display: flex;
            align-items: center;
            font-weight: 700;
          }

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
        `}</style>
      </UserLayout>
    </>
  );
}
