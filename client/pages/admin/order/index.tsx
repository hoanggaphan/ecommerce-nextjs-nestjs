import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Đơn hàng</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Đơn hàng'>
        
      </AdminLayout>
    </>
  );
};

export default IndexPage;
