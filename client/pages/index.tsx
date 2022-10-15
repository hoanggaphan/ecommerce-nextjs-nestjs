import { Card, Container, Grid, Image, Spacer, Text } from '@nextui-org/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import UserLayout from '../components/common/UserLayout';
import { useProducts } from '../libs/swr/useProducts';
import { ProductPaginateType } from '../types';

const Carouse = () => (
  <Swiper slidesPerView={1} navigation={true} modules={[Navigation]}>
    <SwiperSlide>
      <Image
        width='100%'
        height='41.5vw'
        src='/carousel-1.jpg'
        alt='Default Image'
        objectFit='cover'
      />
    </SwiperSlide>
    <SwiperSlide>
      <Image
        width='100%'
        height='41.5vw'
        src='/carousel-2.jpg'
        alt='Default Image'
        objectFit='cover'
      />
    </SwiperSlide>
    <SwiperSlide>
      <Image
        width='100%'
        height='41.5vw'
        src='/carousel-3.jpg'
        alt='Default Image'
        objectFit='cover'
      />
    </SwiperSlide>
    <SwiperSlide>
      <Image
        width='100%'
        height='41.5vw'
        src='/carousel-4.jpg'
        alt='Default Image'
        objectFit='cover'
      />
    </SwiperSlide>
    <SwiperSlide>
      <Image
        width='100%'
        height='41.5vw'
        src='/carousel-5.jpg'
        alt='Default Image'
        objectFit='cover'
      />
    </SwiperSlide>
    <SwiperSlide>
      <Image
        width='100%'
        height='41.5vw'
        src='/carousel-6.jpg'
        alt='Default Image'
        objectFit='cover'
      />
    </SwiperSlide>
  </Swiper>
);

type ItemsListProps = {
  title: string;
  data?: ProductPaginateType;
};
const ItemsList = ({ title, data }: ItemsListProps) => {
  return (
    <div style={{ marginTop: 100 }}>
      <Text
        h2
        size={50}
        css={{
          textGradient: '45deg, $purple600 -20%, $pink600 100%',
        }}
        weight='bold'
      >
        {title}
      </Text>
      <Grid.Container gap={2}>
        {data?.items.map((i) => (
          <Grid key={i.id} xs={3}>
            <Card css={{ mw: '315px' }}>
              <Card.Body css={{ py: '$10' }}>
                <Image width={235} height={235} src={i.images[0].url} />
                <Spacer y={1} />
                <Text h3 css={{ textAlign: 'center', minHeight: 72 }}>
                  {i.name}
                </Text>
                <Text h3 color='secondary' css={{ textAlign: 'center' }}>
                  {i.price.toLocaleString('vi-VN')} đ
                </Text>
              </Card.Body>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </div>
  );
};

const IndexPage: NextPage = () => {
  const { data: productNew } = useProducts('/new?limit=8');
  const { data: productPopular } = useProducts('/popular?limit=8');

  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Carouse />
        <Container md>
          <ItemsList title='Sản phẩm mới' data={productNew} />
          <ItemsList title='Sản nổi bật' data={productPopular} />
        </Container>
      </UserLayout>
    </>
  );
};

export default IndexPage;
