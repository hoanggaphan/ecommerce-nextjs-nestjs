import {
  Button,
  Card,
  Col,
  Container,
  Grid,
  Image,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
import Comment from '../components/common/Comment';
import LikeShare from '../components/common/LikeShare';
import { addItemToCart, selectCart } from '../libs/redux/reducers/cartReducer';
import { useAppDispatch, useAppSelector } from '../libs/redux/store';
import { VariantType } from '../types';

export default function Product() {
  const router = useRouter();
  const { slug } = router.query;
  const { data: product, error, mutate } = useProduct({ slug });
  const [amount, setAmount] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const [selected, setSelected] = useState<VariantType>();

  useEffect(() => {
    if (product) {
      setSelected(product.variants[0]);
    }
  }, [product]);

  // If Product not found, redirect user
  if (
    error &&
    (error.response.status === 400 || error.response.status === 404)
  ) {
    mutate(() => undefined, { revalidate: false });
    router.push('/');
  }

  const handleCartAddItem = (variantId: number) => {
    // If the current product is not in the cart
    const currentVariant = cart.find((i) => i.variantId === variantId);
    if (!currentVariant) {
      const newItem = {
        variantId,
        quantity: amount,
      };

      dispatch(addItemToCart(newItem));
      return;
    }

    // If product is in the cart
    // amount > 3, throw error
    if (currentVariant.quantity + amount > 3) {
      Swal.fire({
        title: 'Không thêm được vào giỏ hàng!',
        text: 'Số lượng sản phẩm này trong giỏ quá lớn',
        icon: 'error',
      });
      return;
    }

    const newItem = {
      variantId,
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
            <Grid.Container>
              <Grid xs={12} sm={6}>
                <div style={{ maxWidth: 400, margin: '0 auto', width: '100%' }}>
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
              </Grid>
              {/* <Spacer y={2} /> */}
              <Grid xs={12} sm={6} direction='column'>
                <Text h2>{product.name}</Text>
                <LikeShare
                  url={
                    process.env.NODE_ENV === 'development'
                      ? 'https://developers.facebook.com/docs/plugins/'
                      : window.location.href
                  }
                />

                {product.variants.length === 1 &&
                product.variants[0].attributeValues.length === 0 ? null : (
                  <>
                    <Spacer y={1} />
                    <Card.Divider />
                    <Spacer y={1} />
                    <Row css={{ columnGap: 10 }}>
                      {product.variants.map((v, i) => (
                        <div
                          className={`attribute-item ${
                            v.id === selected?.id ? 'active' : ''
                          }`}
                          key={v.id}
                          onClick={() => setSelected(v)}
                        >
                          {v.attributeValues.map(
                            (at, index) => (index ? ' - ' : '') + at.value
                          )}
                        </div>
                      ))}
                    </Row>
                  </>
                )}
                <Spacer y={1} />
                <Card.Divider />
                <Spacer y={1} />
                <Row>
                  <Text h2 color='secondary' css={{ mb: 0 }}>
                    {selected?.price.toLocaleString('vi-VN')} đ
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
                  {selected && (
                    <Button
                      onPress={() => handleCartAddItem(selected.id)}
                      shadow
                      color='secondary'
                      auto
                    >
                      Thêm vào giỏ
                    </Button>
                  )}
                </Row>
              </Grid>
            </Grid.Container>
            <Spacer y={4} />
            <Text h2>Mô tả</Text>
            <Row>{product.description}</Row>
            <Spacer y={4} />
            <Text h2>Bình luận</Text>
            <Comment
              url={
                process.env.NODE_ENV === 'development'
                  ? 'https://developers.facebook.com/docs/plugins/comments#configurator'
                  : window.location.href
              }
            />
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

          .attribute-item {
            cursor: pointer;
            padding: 3px 7px;
            border: 2px solid #7828c8;
            border-radius: 12px;
            transition: all 0.3s;
            font-size: 14px;
          }

          .attribute-item:hover {
            background-color: #7828c8;
            color: white;
          }
          .attribute-item.active {
            background-color: #7828c8;
            color: white;
          }
        `}</style>
      </UserLayout>
    </>
  );
}
