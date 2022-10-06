import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/common/AdminLayout';

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sản phẩm</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Sản phẩm'>
        
      </AdminLayout>
    </>
  );
};

export default IndexPage;
