import {
  Button,
  Card,
  Container,
  Grid,
  Input,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { unstable_getServerSession } from 'next-auth/next';
import Head from 'next/head';
import { GetServerSideProps } from 'next/types';
import Select from 'react-select';
import UserLayout from '../components/common/UserLayout';
import useAuthUser from '../libs/hooks/useAuthUser';
import { options } from './api/auth/[...nextauth]';

const selectOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

export default function checkout() {
  useAuthUser(true);

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
                <Card.Body>
                  <Grid.Container gap={2}>
                    <Grid xs={6}>
                      <Input
                        fullWidth
                        label='Họ và tên'
                        placeholder='Vui lòng nhập họ và tên'
                        color='default'
                        clearable
                        rounded={false}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Input
                        fullWidth
                        label='Số điện thoại'
                        placeholder='Vui lòng nhập số điện thoại'
                        color='default'
                        clearable
                        bordered
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Select
                        placeholder='Nhập thành phố'
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: '100%',
                          }),
                        }}
                        options={selectOptions}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Select
                        placeholder='Nhập Quận/Huyện'
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: '100%',
                          }),
                        }}
                        options={selectOptions}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Select
                        placeholder='Nhập Phường/Xã'
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: '100%',
                          }),
                        }}
                        options={selectOptions}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Input
                        fullWidth
                        label='Địa chỉ nhận hàng'
                        placeholder='Vui lòng nhập địa chỉ nhận hàng'
                        color='default'
                        clearable
                        bordered
                      />
                    </Grid>
                  </Grid.Container>
                </Card.Body>
              </Card>
            </div>
            <div className='summary'>
              <Card>
                <Card.Body>
                  <div>
                    <Text b>Mã giảm giá</Text>
                    <Row css={{ mt: 10, columnGap: 5 }}>
                      <Input fullWidth placeholder='Nhập mã giảm giá' />
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
                      <Text size={18} b css={{ color: '$accents9' }}>
                        Cần thanh toán:
                      </Text>
                      <Text size={18} b color='secondary'>
                        0 đ
                      </Text>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </UserLayout>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          column-gap: 30px;
        }
        .info {
          flex: 4;
        }
        .summary {
          flex: 2;
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
