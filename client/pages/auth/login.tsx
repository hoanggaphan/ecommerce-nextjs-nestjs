import {
  Button,
  Card,
  Grid,
  Input,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check ROLES
    if (session && session.roles.includes('admin')) {
      router.replace('/admin/dashboard');
    } else if (session && session.roles.includes('user')) {
      router.replace('/');
    }
  }, [session]);

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
    }
  };

  return (
    <>
      {status === 'unauthenticated' && (
        <Grid.Container
          css={{ h: '100vh' }}
          alignItems='center'
          justify='center'
        >
          <Grid justify='center'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card css={{ minWidth: '300px' }}>
                {error && (
                  <Card.Header>
                    <Text color='error'>{error}</Text>
                  </Card.Header>
                )}
                <Card.Header>
                  <Text b>Đăng nhập</Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ py: '$10' }}>
                  <Spacer y={1} />
                  <Input
                    labelPlaceholder='Username'
                    {...register('username', { required: true })}
                    required
                  />
                  <Spacer y={2} />
                  <Input
                    type='password'
                    labelPlaceholder='Password'
                    {...register('password', { required: true })}
                    required
                  />
                </Card.Body>
                <Card.Divider />
                <Card.Footer>
                  <Row justify='center'>
                    <Button type='submit' size='sm'>
                      Đăng nhập
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>
            </form>
          </Grid>
        </Grid.Container>
      )}
    </>
  );
}
