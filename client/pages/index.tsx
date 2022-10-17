import {
  Badge,
  Card,
  Col,
  Container,
  Grid,
  Image,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import UserLayout from '../components/common/UserLayout';
import { useProducts } from '../libs/swr/useProducts';
import { ProductType } from '../types';

const Carouse = () => (
  <Swiper
    autoplay={{
      delay: 4000,
      disableOnInteraction: false,
    }}
    slidesPerView={1}
    navigation={true}
    modules={[Navigation, Autoplay]}
  >
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
  data?: ProductType[];
};
export const ItemsList = ({ title, data }: ItemsListProps) => {
  return (
    <>
      <Text
        h2
        size={50}
        css={{
          textAlign: 'center',
          textGradient: '45deg, $purple600 -20%, $pink600 100%',
        }}
        weight='bold'
      >
        {title}
      </Text>
      <Grid.Container gap={2}>
        {data?.map((i) => (
          <Grid key={i.id} xs={3}>
            <Link href={`/${i.id}`}>
              <a style={{ width: '100%' }}>
                <Card variant='bordered' isHoverable css={{ mw: '315px' }}>
                  <Card.Header>
                    {i.isNew && (
                      <Badge isSquared variant='flat' color='secondary'>
                        Mới
                      </Badge>
                    )}
                    {i.isPopular && (
                      <Badge isSquared variant='flat' color='error'>
                        Nổi bật
                      </Badge>
                    )}
                  </Card.Header>
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
              </a>
            </Link>
          </Grid>
        ))}
      </Grid.Container>
    </>
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
          <Row css={{ mt: 50 }}>
            <Col>
              <Card variant='bordered' isHoverable>
                <Card.Body css={{ p: 50 }}>
                  <Row align='center'>
                    <div className=''>
                      <Text h2 css={{ fontWeight: 500 }}>
                        Chọn điện thoại
                      </Text>
                      <Text h3 css={{ fontWeight: 400 }}>
                        Mua ngay
                      </Text>
                    </div>
                    <Image
                      width='140px'
                      height='140px'
                      objectFit='cover'
                      src='/iphone-14-pro-tim.jpg'
                      alt=''
                    />
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Spacer x={1} />
            <Col>
              <Card variant='bordered' isHoverable>
                <Card.Body css={{ p: 50 }}>
                  <Row align='center'>
                    <div className=''>
                      <Text h2 css={{ fontWeight: 500 }}>
                        Chọn phụ kiện
                      </Text>
                      <Text h3 css={{ fontWeight: 400 }}>
                        Mua ngay
                      </Text>
                    </div>
                    <Image
                      width='140px'
                      height='140px'
                      objectFit='cover'
                      src='/phu-kien.png'
                      alt=''
                    />
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div style={{ marginTop: 100 }}>
            <ItemsList title='Sản phẩm mới' data={productNew?.items} />
          </div>
          <div style={{ marginTop: 100 }}>
            <ItemsList title='Sản phẩm nổi bật' data={productPopular?.items} />
          </div>
        </Container>
      </UserLayout>
    </>
  );
};

export default IndexPage;
