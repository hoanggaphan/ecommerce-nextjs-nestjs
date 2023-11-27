import { Button, Card, Input, Row, Spacer, Text } from '@nextui-org/react';
import { getSession, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBotChat } from '../../components/common/BotChat';

export default function Login() {
  useBotChat(false);
  const [error, setError] = useState<string | null>();
  const [loaded, setLoaded] = useState<boolean>(false);
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

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [session]);

  return (
    <>
      <section className='container'>
        <div className='bg-preview'>
          {!loaded && (
            <Image
              src='/kata-preview.jpg'
              layout='fill'
              priority
              alt='video preview image'
              objectFit='cover'
            />
          )}
        </div>

        <video
          className='video'
          autoPlay
          muted
          loop
          onLoadedData={() => setLoaded(true)}
        >
          <source src='/katarina.mp4' type='video/mp4' />
          Your browser does not support HTML5 video.
        </video>

        <form
          autoComplete='off'
          autoSave='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Card css={{ width: '300px' }}>
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
            <Card.Divider />
            <Card.Footer css={{ flexDirection: 'column', gap: 5 }}>
              <Text small>
                Trang admin:
                <Text b style={{ marginLeft: 5 }}>
                  /admin/dashboard
                </Text>
              </Text>

              <Text small>
                Acc client:
                <Text b style={{ marginLeft: 5 }}>
                  username1 - Username1
                </Text>
              </Text>

              <Text small>
                Acc admin:
                <Text b style={{ marginLeft: 5 }}>
                  admin123 - Admin123
                </Text>
              </Text>

              <Text small>
                Acc quản lý:
                <Text b style={{ marginLeft: 5 }}>
                  manager1 - Manager1
                </Text>
              </Text>

              <Text small>
                Acc nhân viên:
                <Text b style={{ marginLeft: 5 }}>
                  employee1 - Employee1
                </Text>
              </Text>
            </Card.Footer>
          </Card>
        </form>
      </section>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        .video {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .bg-preview {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </>
  );
}
