import { Button, Card, Container, Grid, Input, Text } from '@nextui-org/react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import UserLayout from '../components/common/UserLayout';
import useAuth from '../libs/hooks/useAuth';
import useMediaQuery from '../libs/hooks/useMediaQuery';
import { useUser } from '../libs/swr/useUser';

export default function Profile() {
  useAuth(true);
  const { data: session } = useSession();
  const { data: user, mutate } = useUser(session?.userId, session?.accessToken);
  const { handleSubmit, register, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName);
      setValue('phone', user.phone);
      setValue('address', user.address);
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${session?.userId}`,
        data,
        {
          headers: { Authorization: 'Bearer ' + session?.accessToken },
        }
      );
      await mutate();

      Swal.fire({
        title: 'Cập nhật thành công!',
        icon: 'success',
      }).then(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
        });
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
        <title>Thông tin cá nhân</title>
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
          THÔNG TIN CÁ NHÂN
        </Text>
        <Container xs>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <Card.Body>
                <Grid.Container gap={1.2}>
                  <Grid xs={6}>
                    <Input
                      {...register('fullName')}
                      fullWidth
                      label='Họ tên'
                      color='default'
                      clearable
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Input
                      {...register('phone', { valueAsNumber: true })}
                      fullWidth
                      label='Số điện thoại'
                      color='default'
                      type='number'
                      clearable
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      {...register('address')}
                      fullWidth
                      label='Địa chỉ'
                      color='default'
                      clearable
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
