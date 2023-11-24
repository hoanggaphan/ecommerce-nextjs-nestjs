import { Button, Card, Input, Row, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useBotChat } from '../../components/common/BotChat';

export default function Register() {
  useBotChat(false);
  const router = useRouter();
  const [error, setError] = useState<string[] | string>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

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
    <>
      <section className='container'>
        <div className='bg-preview'>
          {!loaded && (
            <Image
              src='/ahri-preview.jpg'
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
          <source src='/ahri.mp4' type='video/mp4' />
          Your browser does not support HTML5 video.
        </video>

        <form
          autoComplete='off'
          autoSave='off'
          onSubmit={handleSubmit(onSubmit)}
          className='card-form'
        >
          <Card>
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
            <Card.Divider />
            <Card.Footer css={{ flexDirection: 'column' }}>
              <Text small color='warning'>
                Mật khẩu chứa ít nhất 1 số và 1 kí tự viết hoa
              </Text>
            </Card.Footer>
          </Card>
        </form>
      </section>

      <style jsx>{`
        .container {
          position: relative;
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
        .card-form {
          position: absolute;
          right: 23%;
          bottom: 5%;
          width: 300px;
        }
      `}</style>
    </>
  );
}
