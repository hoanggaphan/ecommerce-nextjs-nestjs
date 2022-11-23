import { Container, Text } from '@nextui-org/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import UserLayout from '../components/common/UserLayout';

export default function Search() {
  const router = useRouter();
  const { key } = router.query;

  return (
    <>
      {' '}
      <Head>
        <title>Kết quả tìm kiếm {key}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <UserLayout>
        <Text
          h2
          size={50}
          css={{
            mt: 50,
            textAlign: 'center',
            textGradient: '45deg, $purple600 -20%, $pink600 100%',
          }}
          weight='bold'
        >
          KẾT QUẢ TÌM KIẾM: {key}
        </Text>
        <Container xs></Container>
      </UserLayout>
    </>
  );
}
