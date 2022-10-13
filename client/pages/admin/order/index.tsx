import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/common/AdminLayout';
import SecureAdminPages from '../../../components/SecureAdminPages';

const IndexPage: NextPage = () => {
  return (
    <SecureAdminPages>
      <Head>
        <title>Đơn hàng</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Đơn hàng'>
        
      </AdminLayout>
    </SecureAdminPages>
  );
};

export default IndexPage;
