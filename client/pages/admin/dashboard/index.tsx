import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/common/AdminLayout';
import SecureAdminPages from '../../../components/SecureAdminPages';

const Admin: NextPage = () => {

  return (
    <SecureAdminPages>
      <Head>
        <title>Trang chủ</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Dash board'>
        
      </AdminLayout>
    </SecureAdminPages>
  );
};

export default Admin;
