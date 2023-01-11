import { Button, Card, Container, Grid, Input, Text } from '@nextui-org/react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import UserLayout from '../components/common/UserLayout';
import useMediaQuery from '../libs/hooks/useMediaQuery';
import { options } from './api/auth/[...nextauth]';

export default function UpdatePassword() {
  const { data: session } = useSession();
  const { handleSubmit, register, reset } = useForm();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push('/');
    }
  }, [session]);

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update-password`,
        { userId: session?.userId, ...data },
        {
          headers: { Authorization: 'Bearer ' + session?.accessToken },
        }
      );

      Swal.fire({
        title: 'Cập nhật mật khẩu thành công!',
        icon: 'success',
      }).then(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
        });
        reset();
      });
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Swal.fire({
          title: error.response.data.message,
          icon: 'error',
        });
        return;
      }
      Swal.fire({
        title: 'Cập nhật thất bại',
        icon: 'error',
      });
    }
  };
  const isXs = useMediaQuery('(min-width: 650px)');

  return (
    <>
      <Head>
        <title>Cập nhật mật khẩu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <UserLayout>
        <Text
          h2
          size={isXs ? 50 : 30}
          css={{
            mt: 50,
            textAlign: 'center',
            textGradient: '45deg, $purple600 -20%, $pink600 100%',
          }}
          weight='bold'
        >
          CẬP NHẬT MẬT KHẨU
        </Text>
        <Container xs>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <Card.Body>
                <Grid.Container gap={1.2}>
                  <Grid xs={12}>
                    <Input
                      {...register('oldPass')}
                      fullWidth
                      label='Mật khẩu cũ'
                      color='default'
                      type='password'
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      {...register('newPass')}
                      fullWidth
                      label='Mật khẩu mới'
                      color='default'
                      type='password'
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      {...register('confirmPass')}
                      fullWidth
                      label='Nhập lại mật khẩu'
                      color='default'
                      type='password'
                    />
                  </Grid>

                  <Grid xs={12} css={{ pt: 0, mt: 15 }}>
                    <Button type='submit' auto shadow color='secondary'>
                      Cập nhật
                    </Button>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </form>
        </Container>
      </UserLayout>
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
