import {
  Button,
  Card,
  Grid,
  Input,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBotChat } from '../../components/common/BotChat';
import { options } from '../api/auth/[...nextauth]';

export default function Login() {
  useBotChat(false);
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res?.error);
    } else {
      const session = await getSession();
      if (
        session &&
        session.roles.some(
          (e: string) => e === 'admin' || e === 'manager' || e === 'employee'
        )
      ) {
        const name = (router.query.name as string) || '/admin/dashboard';
        router.replace(name);
      } else if (session && session.roles.includes('user')) {
        const name = (router.query.name as string) || '/';
        router.replace(name);
      }
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
          <Card css={{ minWidth: '300px' }}>
            {error && (
              <Card.Header>
                <Text color='error'>Lỗi xác thực</Text>
              </Card.Header>
            )}
            <Card.Header css={{ justifyContent: 'center' }}>
              <Text b color='secondary'>
                Đăng nhập
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
            <Card.Footer css={{ flexDirection: 'column' }}>
              <Row justify='center'>
                <Button type='submit' size='sm' color='secondary'>
                  Đăng nhập
                </Button>
              </Row>
              <Row css={{ mt: 10 }}>
                <Text>
                  Chưa có tài khoản?
                  <Link href='/auth/register'>
                    <a
                      style={{
                        textDecoration: 'underline',
                        color: '#7828C8',
                      }}
                    >
                      {' '}
                      Đăng ký
                    </a>
                  </Link>
                </Text>
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

  if (
    session &&
    session.roles.some(
      (e: string) => e === 'admin' || e === 'manager' || e === 'employee'
    )
  ) {
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
