import {
  Button,
  Card,
  Grid,
  Input,
  Row,
  Spacer,
  Text
} from '@nextui-org/react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useBotChat } from '../../components/common/BotChat';
import { options } from '../api/auth/[...nextauth]';

export default function Register() {
  useBotChat(false);
  const router = useRouter();
  const [error, setError] = useState<string[] | string>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setError([]);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        data
      );
      Swal.fire({
        title: 'Tạo thành công!',
        icon: 'success',
      }).then(() => {
        router.push('/auth/login');
      });
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  return (
    <Grid.Container css={{ h: '100vh' }} alignItems='center' justify='center'>
      <Grid justify='center'>
        <form
          autoComplete='off'
          autoSave='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Card css={{ width: '300px' }}>
            <Card.Header style={{ flexDirection: 'column' }}>
              {Array.isArray(error) ? (
                error.map((i, index) => (
                  <Text key={index} color='error' css={{ fontSize: 14 }}>
                    {i}
                  </Text>
                ))
              ) : (
                <Text color='error' css={{ fontSize: 14 }}>
                  {error}
                </Text>
              )}
            </Card.Header>
            <Card.Header css={{ justifyContent: 'center' }}>
              <Text b color='secondary'>
                Đăng ký
              </Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ py: '$10' }}>
              <Spacer y={1} />
              <Input
                labelPlaceholder='Username'
                {...register('username', { required: true })}
                required
                autoComplete='off'
                autoSave='off'
              />
              <Spacer y={2} />
              <Input
                type='password'
                labelPlaceholder='Password'
                {...register('password', { required: true })}
                required
                autoComplete='off'
                autoSave='off'
              />
            </Card.Body>
            <Card.Divider />
            <Card.Footer css={{ flexDirection: 'column' }}>
              <Row justify='center'>
                <Button type='submit' size='sm' color='secondary'>
                  Đăng ký
                </Button>
              </Row>
              <Row css={{ mt: 10 }}>
                <Link href='/auth/login'>
                  <a
                    style={{
                      textDecoration: 'underline',
                      color: '#7828C8',
                    }}
                  >
                    Đăng nhập
                  </a>
                </Link>
              </Row>
            </Card.Footer>
          </Card>
        </form>
      </Grid>
    </Grid.Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    options
  );

  if (session && session.roles.includes('admin')) {
    return {
      redirect: {
        destination: '/admin/dashboard',
        permanent: false,
      },
    };
  } else if (session && session.roles.includes('user')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
