import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cài đặt</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Cài đặt'>
        
      </AdminLayout>
    </>
  );
};

export default IndexPage;
