import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Image,
  Input,
  Radio,
  Row,
  Spacer,
  Text,
  Textarea,
} from '@nextui-org/react';
import { unstable_getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useEffect } from 'react';
import MySelect from '../components/common/MySelect';
import UserLayout from '../components/common/UserLayout';
import useAuthUser from '../libs/hooks/useAuthUser';
import { options } from './api/auth/[...nextauth]';

const selectOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'chocolate11', label: 'Chocolate11' },
  { value: 'strawberry11', label: 'Strawberry11' },
  { value: 'vanilla22', label: 'Vanilla22' },
  { value: 'chocolate22', label: 'Chocolate22' },
  { value: 'strawberry33', label: 'Strawberry33' },
  { value: 'vanilla33', label: 'Vanilla33' },
  { value: 'chocolate44', label: 'Chocolate44' },
  { value: 'strawberry44', label: 'Strawberry44' },
  { value: 'vanilla55', label: 'Vanilla55' },
  { value: 'chocolateaaa', label: 'chocolateaaa' },
  { value: 'strawberrybb', label: 'Strawberrybb' },
  { value: 'vanillacc', label: 'Vanillacc' },
  { value: 'chocolatedd', label: 'Chocolatedd' },
  { value: 'strawberrydd', label: 'Strawberrydd' },
  { value: 'vanillaee', label: 'Vanillaee' },
];

export default function Checkout() {
  useAuthUser(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push('/');
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Thanh toán</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Container md css={{ mt: 50 }}>
          <Text
            h2
            size={50}
            css={{
              textAlign: 'center',
              textGradient: '45deg, $purple600 -20%, $pink600 100%',
            }}
            weight='bold'
          >
            THANH TOÁN
          </Text>

          <div className='container'>
            <div className='info'>
              <Card>
                <Card.Header css={{ columnGap: 5 }}>
                  <div className='order-number'>1</div>
                  <Text b size={24} color='secondary'>
                    Thông tin đặt hàng
                  </Text>
                </Card.Header>
                <Card.Body>
                  <Grid.Container gap={1.2}>
                    <Grid xs={6} css={{ pt: 0 }}>
                      <Input
                        fullWidth
                        label='Họ tên'
                        placeholder='Nhập họ tên'
                        color='default'
                        clearable
                        rounded={false}
                      />
                    </Grid>
                    <Grid xs={6} css={{ pt: 0 }}>
                      <Input
                        fullWidth
                        label='Số điện thoại'
                        placeholder='Nhập số điện thoại'
                        color='default'
                        clearable
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Input
                        fullWidth
                        label='Địa chỉ'
                        placeholder='Nhập địa chỉ'
                        color='default'
                        clearable
                      />
                    </Grid>
                    <Grid xs={6}>
                      <MySelect
                        placeholder='Chọn thành phố'
                        label='Tỉnh/ Thành phố'
                        options={selectOptions}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <MySelect
                        placeholder='Chọn Quận/Huyện'
                        label='Quận/ Huyện'
                        options={selectOptions}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <MySelect
                        placeholder='Chọn Phường/Xã'
                        label='Phường/ Xã'
                        options={selectOptions}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Textarea
                        minRows={4}
                        maxRows={4}
                        placeholder='Ghi chú đơn hàng...'
                        fullWidth
                        aria-label='note'
                      />
                    </Grid>
                  </Grid.Container>
                </Card.Body>
              </Card>
            </div>
            <div className='payment'>
              <Card>
                <Card.Header css={{ columnGap: 5 }}>
                  <div className='order-number'>2</div>
                  <Text b size={24} color='secondary'>
                    Phương thức thanh toán
                  </Text>
                </Card.Header>
                <Card.Body>
                  <Radio.Group
                    aria-labelledby='payment-method'
                    defaultValue='A'
                  >
                    <Radio color='secondary' value='A' size='xs'>
                      Trả tiền mặt khi nhận hàng (COD)
                    </Radio>
                    <Radio color='secondary' value='B' size='xs'>
                      Thanh toán qua Zalo Pay
                    </Radio>
                  </Radio.Group>
                </Card.Body>
              </Card>
            </div>
            <div className='summary'>
              <Card>
                <Card.Header css={{ columnGap: 5 }}>
                  <div className='order-number'>3</div>
                  <Text b size={24} color='secondary'>
                    Thông tin giỏ hàng
                  </Text>
                </Card.Header>

                <Card.Body>
                  <div>
                    <Row css={{ columnGap: 15, mb: 25 }} align='center'>
                      <Badge
                        color='secondary'
                        content={5}
                        shape='rectangle'
                        size='md'
                      >
                        <Image
                          width={40}
                          height={40}
                          alt=''
                          src='https://cdn-dgcei.nitrocdn.com/QaFavQVnaqgHtiSsAelwGDKVguOuACXM/assets/static/optimized/rev-6ceb543/wp-content/uploads/2022/09/iP14-ProM.png'
                        />
                      </Badge>
                      <div>
                        <Text
                          css={{
                            lineHeight: 1,
                            fontWeight: 500,
                            color: '$gray900',
                          }}
                          size={14}
                        >
                          Product Name
                        </Text>
                        <Text
                          color='$accents7'
                          b
                          css={{ lineHeight: 1 }}
                          size={13}
                        >
                          Blue, 32GB - 9.000.000 đ
                        </Text>
                      </div>
                    </Row>
                    <Row css={{ columnGap: 15, mb: 25 }} align='center'>
                      <Badge
                        color='secondary'
                        content={5}
                        shape='rectangle'
                        size='md'
                      >
                        <Image
                          width={40}
                          height={40}
                          alt=''
                          src='https://cdn-dgcei.nitrocdn.com/QaFavQVnaqgHtiSsAelwGDKVguOuACXM/assets/static/optimized/rev-6ceb543/wp-content/uploads/2022/09/iP14-ProM.png'
                        />
                      </Badge>
                      <div>
                        <Text
                          css={{
                            lineHeight: 1,
                            fontWeight: 500,
                            color: '$gray900',
                          }}
                          size={14}
                        >
                          Product Name
                        </Text>
                        <Text
                          color='$accents7'
                          b
                          css={{ lineHeight: 1 }}
                          size={13}
                        >
                          Blue, 32GB - 9.000.000 đ
                        </Text>
                      </div>
                    </Row>
                    <Row css={{ columnGap: 15, mb: 25 }} align='center'>
                      <Badge
                        color='secondary'
                        content={5}
                        shape='rectangle'
                        size='md'
                      >
                        <Image
                          width={40}
                          height={40}
                          alt=''
                          src='https://cdn-dgcei.nitrocdn.com/QaFavQVnaqgHtiSsAelwGDKVguOuACXM/assets/static/optimized/rev-6ceb543/wp-content/uploads/2022/09/iP14-ProM.png'
                        />
                      </Badge>
                      <div>
                        <Text
                          css={{
                            lineHeight: 1,
                            fontWeight: 500,
                            color: '$gray900',
                          }}
                          size={14}
                        >
                          Product Name
                        </Text>
                        <Text
                          color='$accents7'
                          b
                          css={{ lineHeight: 1 }}
                          size={13}
                        >
                          Blue, 32GB - 9.000.000 đ
                        </Text>
                      </div>
                    </Row>
                  </div>

                  <div>
                    <Row css={{ columnGap: 5 }} align='flex-end'>
                      <Input
                        fullWidth
                        label='Mã giảm giá'
                        placeholder='Nhập mã giảm giá'
                      />
                      <Button auto flat color='secondary'>
                        Áp dụng
                      </Button>
                    </Row>
                    <Spacer y={1} />
                    <Row css={{ mb: 5 }} justify='space-between'>
                      <Text css={{ color: '$accents9' }}>Tổng:</Text>
                      <Text css={{ color: '$accents9' }}>0 đ</Text>
                    </Row>
                    <Row css={{ mb: 5 }} justify='space-between'>
                      <Text css={{ color: '$accents9' }}>Phí vận chuyển:</Text>
                      <Text css={{ color: '$accents9' }}>0 đ</Text>
                    </Row>
                    <Row css={{ mb: 5 }} justify='space-between'>
                      <Text css={{ color: '$accents9' }}>Giảm:</Text>
                      <Text css={{ color: '$accents9' }}>0 đ</Text>
                    </Row>
                    <Spacer y={1} />
                    <Card.Divider />
                    <Spacer y={1} />
                    <Row justify='space-between'>
                      <Text size={18} b color='secondary'>
                        Cần thanh toán:
                      </Text>
                      <Text size={18} b color='secondary'>
                        0 đ
                      </Text>
                    </Row>

                    <Row css={{ mt: 20 }}>
                      <Button
                        css={{ w: '100%' }}
                        shadow
                        color='secondary'
                        size='md'
                      >
                        Đặt hàng
                      </Button>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </UserLayout>
      <style jsx>{`
        .order-number {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 24px;
          color: white;
          background-color: #7828c8;
          border-radius: 10px;
        }
        .container {
          display: flex;
          justify-content: space-between;
          column-gap: 30px;
        }
        .info {
          flex: 4;
        }
        .payment {
          flex: 4;
        }
        .summary {
          flex: 3;
        }
      `}</style>
      <style jsx global>{`
        .nextui-radio-point {
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    options
  );

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
