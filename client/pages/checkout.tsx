import { Container } from '@nextui-org/react';
import Head from 'next/head';
import UserLayout from '../components/common/UserLayout';

export default function checkout() {
  return (
    <>
      <Head>
        <title>Thanh toán</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Container md>Thanh toán</Container>
      </UserLayout>
    </>
  );
}
