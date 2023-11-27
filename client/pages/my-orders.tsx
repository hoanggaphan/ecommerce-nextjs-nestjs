import {
  Card,
  Col,
  Collapse,
  Container,
  Pagination,
  Row,
  Text,
} from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useSWR from 'swr';
import UserLayout from '../components/common/UserLayout';
import useAuth from '../libs/hooks/useAuth';
import useMediaQuery from '../libs/hooks/useMediaQuery';
import { OrderPaginateType } from '../types';

const allFetcher = (url: string, body: any, token: string) => {
  return axios
    .post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
const AllTabContent = ({
  page,
  setPage,
  type,
}: {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  type: number;
}) => {
  const { data: session } = useSession();
  const { data } = useSWR<OrderPaginateType>(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/order/list?page=${page}&limit=10&type=${type}`,
          {
            userId: session.userId,
          },
          session?.accessToken,
        ]
      : null,
    allFetcher
  );
  const router = useRouter();

  const handleChange = (index: number) => setPage(index);

  return (
    <>
      {data && data?.items.length > 0 ? (
        <>
          <Collapse.Group divider={false}>
            {data?.items.map((i) => (
              <Collapse
                key={i.id}
                title={`Đơn hàng ${i.id} - ${new Date(
                  i.createdDate
                ).toLocaleString('vi-VN')}`}
                css={{
                  '.nextui-collapse-title': {
                    fontWeight: 400,
                    fontSize: 20,
                  },
                }}
              >
                {i.orderItems.map((o) => (
                  <Row key={`item ${o.id}`}>
                    <Col span={6}>
                      <Text b as='p'>
                        {o.variant.product?.name}
                        {o.variant.attributeValues?.length > 0 &&
                          o.variant.attributeValues.map((i, index) => (
                            <Text key={i.id + i.value} as='span'>
                              {(index === 0 ? ' - ' : ', ') + i.value}
                            </Text>
                          ))}
                      </Text>
                    </Col>
                    <Col span={3}>
                      <Text css={{ textAlign: 'center' }}>
                        {o.orderedQuantity}
                      </Text>
                    </Col>
                    <Col span={3}>
                      {' '}
                      <Text css={{ textAlign: 'center' }}>
                        {o.orderedPrice.toLocaleString('vi-VN')} đ
                      </Text>
                    </Col>
                  </Row>
                ))}

                <Text
                  blockquote
                  css={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => router.push(`/order/${i.id}`)}
                >
                  Chi tiết
                </Text>
              </Collapse>
            ))}
          </Collapse.Group>
          {data && (
            <Row justify='center' css={{ marginTop: 20, marginBottom: 20 }}>
              <Pagination
                shadow
                color='secondary'
                total={data?.meta.totalPages}
                onChange={(page) => handleChange(page)}
                page={page}
              />
            </Row>
          )}
        </>
      ) : (
        <Row
          justify='center'
          align='center'
          css={{ pt: 40, pb: 40, flexDirection: 'column' }}
        >
          <Image
            width='100px'
            height='100px'
            src='/order.png'
            alt='order Image'
            objectFit='cover'
          />
          <Text size='$2xl' css={{ mt: 20 }}>
            Chưa có đơn hàng
          </Text>
        </Row>
      )}
    </>
  );
};

export default function MyOrders() {
  useAuth(true);
  const [allPage, setAllPage] = useState(1);
  const [processingPage, setProcessingPage] = useState(1);
  const [deliveringPage, setDeliveringPage] = useState(1);
  const [deliveredPage, setDeliveredPage] = useState(1);
  const [cancelPage, setCancelPage] = useState(1);
  const [returnPage, setReturnPage] = useState(1);
  const [refundPage, setRefundPage] = useState(1);
  const isXs = useMediaQuery('(min-width: 650px)');

  return (
    <>
      <Head>
        <title>Đơn hàng của tôi</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Text
          h2
          size={isXs ? 50 : 30}
          css={{
            mt: 50,
            textAlign: 'center',
            textGradient: '45deg, $purple600 -20%, $pink600 100%',
          }}
          weight='bold'
        >
          ĐƠN HÀNG CỦA TÔI
        </Text>
        <Container xs>
          <Tabs>
            <Card>
              <Card.Header>
                {' '}
                <TabList>
                  <Tab>
                    <Text size={14} color='inherit'>
                      Tất cả
                    </Text>
                  </Tab>
                  <Tab>
                    <Text size={14} color='inherit'>
                      Đang xử lý
                    </Text>
                  </Tab>
                  <Tab>
                    <Text size={14} color='inherit'>
                      Đang vận chuyển
                    </Text>
                  </Tab>
                  <Tab>
                    <Text size={14} color='inherit'>
                      Đã giao hàng
                    </Text>
                  </Tab>
                  <Tab>
                    <Text size={14} color='inherit'>
                      Đã hủy
                    </Text>
                  </Tab>
                  <Tab>
                    <Text size={14} color='inherit'>
                      Trả hàng
                    </Text>
                  </Tab>
                  <Tab>
                    <Text size={14} color='inherit'>
                      Hoàn tiền
                    </Text>
                  </Tab>
                </TabList>
              </Card.Header>

              <Card.Body>
                <TabPanel>
                  <AllTabContent page={allPage} setPage={setAllPage} type={0} />
                  <div style={{ display: 'none' }}>
                    <AllTabContent
                      page={allPage + 1}
                      setPage={setAllPage}
                      type={0}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <AllTabContent
                    page={processingPage}
                    setPage={setProcessingPage}
                    type={1}
                  />
                  <div style={{ display: 'none' }}>
                    <AllTabContent
                      page={processingPage + 1}
                      setPage={setProcessingPage}
                      type={1}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <AllTabContent
                    page={deliveringPage}
                    setPage={setDeliveringPage}
                    type={2}
                  />
                  <div style={{ display: 'none' }}>
                    <AllTabContent
                      page={deliveringPage + 1}
                      setPage={setDeliveringPage}
                      type={2}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <AllTabContent
                    page={deliveredPage}
                    setPage={setDeliveredPage}
                    type={3}
                  />
                  <div style={{ display: 'none' }}>
                    <AllTabContent
                      page={deliveredPage + 1}
                      setPage={setDeliveredPage}
                      type={3}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <AllTabContent
                    page={cancelPage}
                    setPage={setCancelPage}
                    type={4}
                  />
                  <div style={{ display: 'none' }}>
                    <AllTabContent
                      page={cancelPage + 1}
                      setPage={setCancelPage}
                      type={4}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <AllTabContent
                    page={returnPage}
                    setPage={setReturnPage}
                    type={5}
                  />
                  <div style={{ display: 'none' }}>
                    <AllTabContent
                      page={returnPage + 1}
                      setPage={setReturnPage}
                      type={5}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <AllTabContent
                    page={refundPage}
                    setPage={setRefundPage}
                    type={6}
                  />
                  <div style={{ display: 'none' }}>
                    <AllTabContent
                      page={refundPage + 1}
                      setPage={setRefundPage}
                      type={6}
                    />
                  </div>
                </TabPanel>
              </Card.Body>
            </Card>
          </Tabs>
        </Container>
      </UserLayout>
      <style jsx global>{`
        .react-tabs__tab {
          border: none;
          border-radius: 12px;
          margin: 0;
        }
        .react-tabs__tab--selected {
          background: #eadcf8;
          color: #7828c8 !important;
        }
        .react-tabs__tab-list {
          border-bottom: unset;
          margin: 0;
        }
      `}</style>
    </>
  );
}
