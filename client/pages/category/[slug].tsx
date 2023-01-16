import { Container } from '@nextui-org/react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { ItemsList } from '..';
import UserLayout from '../../components/common/UserLayout';
import { CategoryType, ProductType } from '../../types';

const proFetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Slug() {
  const router = useRouter();
  const { slug } = router.query;
  const { data: products } = useSWR<ProductType[]>(
    slug ? `${process.env.NEXT_PUBLIC_API_URL}/product/category/${slug}` : null,
    proFetcher
  );
  const {
    data: category,
    error: errorCate,
    mutate: mutateCate,
  } = useSWR<CategoryType>(
    slug ? `${process.env.NEXT_PUBLIC_API_URL}/category/${slug}` : null,
    proFetcher
  );

  if (
    errorCate &&
    errorCate.response &&
    (errorCate.response.status === 400 || errorCate.response.status === 404)
  ) {
    mutateCate(() => undefined, { revalidate: false }); // Xóa cache nếu lỗi
    router.push('/');
  }

  const renderData = () => {
    // if (!products) return 'Loading...';
    if (products && products.length === 0) return 'Chưa có sản phẩm';
    return <ItemsList title={category?.name || ''} data={products} />;
  };

  return (
    <>
      <Head>
        <title>{category?.name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Container md>
          <div style={{ marginTop: 50 }}>{renderData()}</div>
        </Container>
      </UserLayout>
    </>
  );
}
