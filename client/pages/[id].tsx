import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';
import UserLayout from '../components/common/UserLayout';
import { useProduct } from '../libs/swr/useProduct';

export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  const { data: product } = useProduct({ id });
  const [amount, setAmount] = useState(1);

  return (
    <>
      <Head>
        <title>{product?.name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        {product ? (
          <Container md css={{ pt: 80 }}>
            <Row>
              <Col span={6}>
                <Row justify='center'>
                  <Image
                    width={400}
                    height={400}
                    src={product.images[0].url || ''}
                    alt=''
                    objectFit='cover'
                  />
                </Row>
              </Col>
              <Spacer y={2} />
              <Col span={6}>
                <Text h2>{product.name}</Text>
                <Row>
                  {product.attributeValues.map((i) => (
                    <Col>
                      <Text size='$xl'>
                        {i.attribute.name.toUpperCase()}:{' '}
                        {i.value.toUpperCase()}
                      </Text>
                    </Col>
                  ))}
                </Row>
                <Spacer y={1} />
                <Card.Divider />
                <Spacer y={1} />
                <Row>
                  <Text size='$3xl'>Giá: &nbsp;</Text>
                  <Text h2 color='secondary' css={{ mb: 0 }}>
                    {product.price.toLocaleString('vi-VN')} đ
                  </Text>
                </Row>
                <Spacer y={2} />
                <Row>
                  <div className='amountContainer'>
                    <Button
                      onPress={() => amount > 1 && setAmount(amount - 1)}
                      color='secondary'
                      auto
                      flat
                      icon={<MdRemove fill='currentColor' size={24} />}
                    />
                    <div className='amount'>{amount}</div>
                    <Button
                      onPress={() => amount < 3 && setAmount(amount + 1)}
                      color='secondary'
                      auto
                      flat
                      icon={<MdAdd fill='currentColor' size={24} />}
                    />
                  </div>
                  <Spacer x={2} />
                  <Button shadow color='secondary' auto>
                    Thêm vào giỏ
                  </Button>
                </Row>
              </Col>
            </Row>
            <Spacer y={4} />
            <Text h2>Mô tả</Text>
            <Row>{product.description}</Row>
          </Container>
        ) : (
          'Loading...'
        )}
        <style jsx>{`
          .amountContainer {
            display: flex;
            align-items: center;
            font-weight: 700;
          }

          .amount {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: 1px solid #7828c8;
            color: #7828c8;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0px 5px;
          }
        `}</style>
      </UserLayout>
    </>
  );
}
