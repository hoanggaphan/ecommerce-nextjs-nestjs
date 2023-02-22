import {
  Badge,
  Card,
  Container,
  Grid,
  Image,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import type { NextPage } from 'next';
import NextImg from 'next/image';
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
import useMediaQuery from '../libs/hooks/useMediaQuery';
import { useProducts } from '../libs/swr/useProducts';
import { ArticleType, ProductType } from '../types';
import carousel1 from '../public/carousel-1.jpg';
import carousel2 from '../public/carousel-2.jpg';
import carousel3 from '../public/carousel-3.jpg';
import carousel4 from '../public/carousel-4.jpg';
import carousel5 from '../public/carousel-5.jpg';
import carousel6 from '../public/carousel-6.jpg';

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
      <div style={{ width: '100%', height: '41.5vw' }}>
        <NextImg
          src={carousel1}
          layout='fill'
          priority
          objectFit='cover'
          alt='Default Image'
        />
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div style={{ width: '100%', height: '41.5vw' }}>
        <NextImg
          src={carousel2}
          layout='fill'
          priority
          objectFit='cover'
          alt='Default Image'
        />
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div style={{ width: '100%', height: '41.5vw' }}>
        <NextImg
          src={carousel3}
          layout='fill'
          priority
          objectFit='cover'
          alt='Default Image'
        />
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div style={{ width: '100%', height: '41.5vw' }}>
        <NextImg
          src={carousel4}
          layout='fill'
          priority
          objectFit='cover'
          alt='Default Image'
        />
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div style={{ width: '100%', height: '41.5vw' }}>
        <NextImg
          src={carousel5}
          layout='fill'
          priority
          objectFit='cover'
          alt='Default Image'
        />
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div style={{ width: '100%', height: '41.5vw' }}>
        <NextImg
          src={carousel6}
          layout='fill'
          priority
          objectFit='cover'
          alt='Default Image'
        />
      </div>
    </SwiperSlide>
  </Swiper>
);

type ItemsListProps = {
  title: string;
  data?: ProductType[];
};
export const ItemsList = ({ title, data }: ItemsListProps) => {
  const isXs = useMediaQuery('(min-width: 650px)');
  const isMobile = useMediaQuery('(max-width: 360px)');

  return (
    <>
      {data ? (
        <Text
          h2
          size={isXs ? 50 : 30}
          css={{
            textAlign: 'center',
            textGradient: '45deg, $purple600 -20%, $pink600 100%',
          }}
          weight='bold'
        >
          {title}
        </Text>
      ) : (
        <div style={{ height: isXs ? 85 : 55, width: '100%' }}></div>
      )}

      <Grid.Container gap={isXs ? 2 : 1}>
        {data
          ? data.map((i) => (
              <Grid key={i.id} xs={6} sm={3}>
                <Link href={`/${i.slug}`}>
                  <a style={{ width: '100%' }}>
                    <Card variant='bordered' isHoverable>
                      <Card.Header css={{ pb: 0, minHeight: 40 }}>
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
                      <Card.Body css={{ py: isMobile ? '$6' : '$10' }}>
                        <Image
                          width={isXs ? 235 : 100}
                          height={isXs ? 235 : 100}
                          src={i.images[0].url}
                        />
                        <Spacer y={1} />
                        <Text
                          h3
                          css={{
                            textAlign: 'center',
                            fontSize: isXs ? 24 : 16,
                            minHeight: isXs ? 72 : 48,
                            marginBottom: isMobile ? 0 : 10,
                          }}
                          className='line-clamp-2'
                        >
                          {i.name}
                        </Text>
                        <Text
                          h3
                          color='secondary'
                          css={{
                            textAlign: 'center',
                            fontSize: isXs ? 24 : 16,
                            marginBottom: isMobile ? 0 : 10,
                          }}
                        >
                          {i.variants[0].price.toLocaleString('vi-VN')} đ
                        </Text>
                      </Card.Body>
                    </Card>
                  </a>
                </Link>
              </Grid>
            ))
          : [...new Array(4)].map((_, i) => (
              <Grid key={i} xs={6} sm={3}>
                <Skeleton />
              </Grid>
            ))}
      </Grid.Container>
    </>
  );
};
const Skeleton = () => {
  const isXs = useMediaQuery('(min-width: 650px)');
  const isMobile = useMediaQuery('(max-width: 360px)');

  return (
    <Card variant='bordered' isHoverable css={{ backgroundColor: '$accents0' }}>
      <Card.Header css={{ pb: 0, minHeight: 40 }}></Card.Header>
      <Card.Body css={{ py: isMobile ? '$6' : '$10' }}>
        <div
          style={{ width: isXs ? 235 : 100, height: isXs ? 235 : 100 }}
        ></div>
        <Spacer y={1} />
        <Text
          h3
          css={{
            textAlign: 'center',
            fontSize: isXs ? 24 : 16,
            minHeight: isXs ? 72 : 48,
            marginBottom: isMobile ? 0 : 10,
          }}
          className='line-clamp-2'
        ></Text>
        <Text
          h3
          color='secondary'
          css={{
            textAlign: 'center',
            fontSize: isXs ? 24 : 16,
            marginBottom: isMobile ? 0 : 10,
          }}
        ></Text>
      </Card.Body>
    </Card>
  );
};

const ProductNew = () => {
  const { data: productNew } = useProducts('/new?limit=8');
  return <ItemsList title='Sản phẩm mới' data={productNew?.items} />;
};

const ProductPopular = () => {
  const { data: productPopular } = useProducts('/popular?limit=8');
  return <ItemsList title='Sản phẩm nổi bật' data={productPopular?.items} />;
};

const Articles = () => {
  const {
    data: articles,
    error,
    mutate,
    isValidating,
  } = useSWR<ArticleType[]>('/articles/home', getAllArticlesForHome);
  const isXs = useMediaQuery('(min-width: 650px)');

  return (
    <>
      <Text
        h2
        size={isXs ? 50 : 30}
        css={{
          textAlign: 'center',
          textGradient: '45deg, $purple600 -20%, $pink600 100%',
        }}
        weight='bold'
      >
        Bài viết mới nhất
      </Text>

      <Grid.Container gap={isXs ? 2 : 1}>
        {articles
          ? articles.map((i) => (
              <Grid key={i.slug} xs={12} sm={4}>
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
            ))
          : [...new Array(3)].map((_, i) => (
              <Grid key={i} xs={12} sm={4}>
                <Card
                  variant='bordered'
                  isHoverable
                  css={{ backgroundColor: '$accents0' }}
                >
                  <Card.Body css={{ p: 0 }}>
                    <div
                      style={{
                        width: '100%',
                        height: 218,
                      }}
                    ></div>
                  </Card.Body>
                  <Card.Footer
                    css={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  ></Card.Footer>
                </Card>
              </Grid>
            ))}
      </Grid.Container>
    </>
  );
};
const IndexPage: NextPage = () => {
  const isXs = useMediaQuery('(min-width: 650px)');

  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Carousel />
        <Container md>
          <Grid.Container gap={1} css={{ mt: 50 }}>
            <Grid xs={12} sm={6}>
              <Card variant='bordered' isHoverable>
                <Card.Body css={{ p: isXs ? 50 : 30 }}>
                  <Row
                    align='center'
                    css={{ flexDirection: isXs ? 'row' : 'column' }}
                  >
                    <div className=''>
                      <Text
                        h2
                        css={{ fontWeight: 500, fontSize: isXs ? 36 : 24 }}
                      >
                        Chọn điện thoại
                      </Text>
                      <Text
                        h3
                        css={{
                          fontWeight: 400,
                          fontSize: isXs ? 24 : 20,
                          textAlign: isXs ? 'start' : 'center',
                        }}
                      >
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
            </Grid>
            <Grid xs={12} sm={6}>
              <Card variant='bordered' isHoverable>
                <Card.Body css={{ p: isXs ? 50 : 30 }}>
                  <Row
                    align='center'
                    css={{ flexDirection: isXs ? 'row' : 'column' }}
                  >
                    <div className=''>
                      <Text
                        h2
                        css={{ fontWeight: 500, fontSize: isXs ? 36 : 24 }}
                      >
                        Chọn phụ kiện
                      </Text>
                      <Text
                        h3
                        css={{
                          fontWeight: 400,
                          fontSize: isXs ? 24 : 20,
                          textAlign: isXs ? 'start' : 'center',
                        }}
                      >
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
            </Grid>
          </Grid.Container>
          <div style={{ marginTop: isXs ? 100 : 50 }}>
            <ProductNew />
          </div>
          <div style={{ marginTop: isXs ? 100 : 50 }}>
            <ProductPopular />
          </div>
          <div style={{ marginTop: isXs ? 100 : 50 }}>
            <Articles />
          </div>
        </Container>
      </UserLayout>
    </>
  );
};

export default IndexPage;
