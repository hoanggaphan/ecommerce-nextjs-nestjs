import { Container } from '@nextui-org/react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { ItemsList } from '..';
import UserLayout from '../../components/common/UserLayout';
import { server } from '../../libs/constants';
import { ProductType } from '../../types';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  isActive: boolean;
  products: ProductType[];
};

export default function Slug() {
  const router = useRouter();
  const { slug } = router.query;
  const { data, error, mutate } = useSWR<Category>(
    slug ? `${server}/category/${slug}/products` : null,
    fetcher
  );
  console.log(error);
  if (
    error &&
    (error.response.status === 400 || error.response.status === 404)
  ) {
    mutate(() => undefined, { revalidate: false });
    router.push('/');
  }

  return (
    <>
      <Head>
        <title>{data?.name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        {data ? (
          <Container md>
            <div style={{ marginTop: 50 }}>
              {data.products.length === 0 ? (
                'Chưa có sản phẩm'
              ) : (
                <ItemsList title={data.name} data={data.products} />
              )}
            </div>
          </Container>
        ) : (
          'Loading...'
        )}
      </UserLayout>
    </>
  );
}
