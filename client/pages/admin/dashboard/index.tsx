import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/common/AdminLayout';

const Admin: NextPage = () => {
  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Dash board'>
        
      </AdminLayout>
    </>
  );
};

export default Admin;
