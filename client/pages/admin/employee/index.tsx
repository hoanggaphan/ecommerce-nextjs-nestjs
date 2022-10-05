import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nhân viên</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Nhân viên'>
        
      </AdminLayout>
    </>
  );
};

export default IndexPage;
