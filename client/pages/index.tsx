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
import useSWR from 'swr';
import UserLayout from '../components/common/UserLayout';
import { dayFromNow } from '../libs/dayjs';
import { getAllArticlesForHome } from '../libs/graphcms';
import { useProducts } from '../libs/swr/useProducts';
import { ArticleType, ProductType } from '../types';

const Carousel = () => (
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
            <Link href={`/${i.slug}`}>
              <a style={{ width: '100%' }}>
                <Card variant='bordered' isHoverable css={{ mw: '315px' }}>
                  <Card.Header css={{ pb: 0, minHeight: 40 }}>
                    {i.isNew && (
                      <Badge isSquared variant='flat' color='secondary'>
                        M???i
                      </Badge>
                    )}
                    {i.isPopular && (
                      <Badge isSquared variant='flat' color='error'>
                        N???i b???t
                      </Badge>
                    )}
                  </Card.Header>
                  <Card.Body css={{ py: '$10' }}>
                    <Image width={235} height={235} src={i.images[0].url} />
                    <Spacer y={1} />
                    <Text
                      h3
                      css={{ textAlign: 'center', minHeight: 72 }}
                      className='line-clamp-2'
                    >
                      {i.name}
                    </Text>
                    <Text h3 color='secondary' css={{ textAlign: 'center' }}>
                      {i.variants[0].price.toLocaleString('vi-VN')} ??
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

const ProductNew = () => {
  const { data: productNew } = useProducts('/new?limit=8');
  return <ItemsList title='S???n ph???m m???i' data={productNew?.items} />;
};

const ProductPopular = () => {
  const { data: productPopular } = useProducts('/popular?limit=8');
  return <ItemsList title='S???n ph???m n???i b???t' data={productPopular?.items} />;
};

const Articles = () => {
  const {
    data: articles,
    error,
    mutate,
    isValidating,
  } = useSWR<ArticleType[]>('/articles/home', getAllArticlesForHome);

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
        B??i vi???t m???i nh???t
      </Text>

      <Grid.Container gap={2}>
        {articles?.map((i) => (
          <Grid key={i.slug} xs={4}>
            <Link href={`article/${i.slug}`}>
              <a style={{ width: '100%' }}>
                <Card variant='bordered' isHoverable>
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      src={i.bannerImage.url}
                      objectFit='cover'
                      width='100%'
                      height={218}
                      alt=''
                    />
                  </Card.Body>
                  <Card.Footer
                    css={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text h3 className='line-clamp-2'>
                      {i.title}
                    </Text>
                    <Text
                      css={{
                        color: '$accents7',
                        fontWeight: '$semibold',
                        fontSize: '$sm',
                      }}
                    >
                      {dayFromNow(i.publishedAt)}
                    </Text>
                  </Card.Footer>
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
  return (
    <>
      <Head>
        <title>Trang ch???</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Carousel />
        <Container md>
          <Row css={{ mt: 50 }}>
            <Col>
              <Card variant='bordered' isHoverable>
                <Card.Body css={{ p: 50 }}>
                  <Row align='center'>
                    <div className=''>
                      <Text h2 css={{ fontWeight: 500 }}>
                        Ch???n ??i???n tho???i
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
                        Ch???n ph??? ki???n
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
            <ProductNew />
          </div>
          <div style={{ marginTop: 100 }}>
            <ProductPopular />
          </div>
          <div style={{ marginTop: 100 }}>
            <Articles />
          </div>
        </Container>
      </UserLayout>
    </>
  );
};

export default IndexPage;
