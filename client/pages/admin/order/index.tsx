import {
  Badge,
  Dropdown,
  FormElement,
  Input,
  Pagination,
  Row,
  styled,
  Table,
  Text,
} from '@nextui-org/react';
import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import AdminLayout from '../../../components/common/AdminLayout';
import SecureAdminPages from '../../../components/SecureAdminPages';
import { useAdminOrders } from '../../../libs/swr/useAdminOrders';
import { OrderType } from '../../../types';

// Badge component will be available as part of the core library soon
export const StyledBadge = styled('span', {
  display: 'inline-block',
  textTransform: 'uppercase',
  padding: '$2 $3',
  margin: '0 2px',
  fontSize: '10px',
  fontWeight: '$bold',
  borderRadius: '14px',
  letterSpacing: '0.6px',
  lineHeight: 1,
  boxShadow: '1px 2px 5px 0px rgb(0 0 0 / 5%)',
  alignItems: 'center',
  alignSelf: 'center',
  color: '$white',
  variants: {
    type: {
      active: {
        bg: '$successLight',
        color: '$successLightContrast',
      },
      paused: {
        bg: '$errorLight',
        color: '$errorLightContrast',
      },
      vacation: {
        bg: '$warningLight',
        color: '$warningLightContrast',
      },
    },
  },
  defaultVariants: {
    type: 'active',
  },
});

export const IconButton = styled('button', {
  dflex: 'center',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '0',
  margin: '0',
  bg: 'transparent',
  transition: '$default',
  '&:hover': {
    opacity: '0.8',
  },
  '&:active': {
    opacity: '0.6',
  },
});

const IndexPage: NextPage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [temp, setTemp] = useState('');

  const handleEnter = async (e: React.KeyboardEvent<FormElement>) => {
    if (e.key === 'Enter') {
      setKeyword(temp);
    }
  };

  const handleChange = (e: ChangeEvent<FormElement>) => setTemp(e.target.value);

  return (
    <SecureAdminPages>
      <>
        <Head>
          <title>S???n ph???m</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <AdminLayout title='????n h??ng'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Input
              onChange={handleChange}
              onKeyUp={handleEnter}
              aria-label='order-search'
              placeholder='Nh???p id | t??n | t??i kho???n'
              size='lg'
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <Page
              keyword={keyword}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
            />
            <div style={{ display: 'none' }}>
              <Page
                keyword={keyword}
                pageIndex={pageIndex + 1}
                setPageIndex={setPageIndex}
              />
            </div>
          </div>
        </AdminLayout>
      </>
    </SecureAdminPages>
  );
};

const columns = [
  { name: 'M?? ????n h??ng', uid: 'id' },
  { name: 'Kh??ch h??ng', uid: 'customer' },
  { name: 'T??i kho???n', uid: 'username' },
  { name: 'M???t h??ng', uid: 'items' },
  { name: 'Gi??', uid: 'price' },
  { name: 'Ph????ng th???c', uid: 'method' },
  { name: 'Thanh to??n', uid: 'payment' },
  { name: 'Tr???ng th??i', uid: 'status' },
  { name: 'Ng??y ?????t', uid: 'date' },
  { name: 'h??nh ?????ng', uid: 'actions' },
];

const orderStatus = (status: string) => {
  if (status === 'processing') return '??ang x??? l??';
  if (status === 'delivering') return '??ang v???n chuy???n';
  if (status === 'delivered') return '???? giao h??ng';
  if (status === 'refund') return 'ho??n ti???n';
  if (status === 'return') return 'tr??? l???i';
  return 'h???y';
};

const orderStatusColor = (status: string) => {
  if (status === 'processing') return 'warning';
  if (status === 'delivering') return 'primary';
  if (status === 'delivered') return 'success';
  if (status === 'return') return 'error';
  return 'default';
};

const Page = ({
  keyword,
  pageIndex,
  setPageIndex,
}: {
  keyword: string;
  pageIndex: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    data: orders,
    error,
    mutate,
  } = useAdminOrders(
    `?limit=20&page=${pageIndex}&name=${keyword}`,
    session?.accessToken
  );

  const handleChange = (page: number) => {
    setPageIndex(page);
  };

  const handleCancle = async (order: OrderType) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/order/update-status/${order.id}`,
      {
        orderStatus: 'cancel',
        isPaid: order.paymentMethod === 'COD' ? false : order.isPaid,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    await mutate();
  };

  const renderCell = (order: OrderType, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {order.id}
          </Text>
        );

      case 'customer':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {order.fullName}
          </Text>
        );

      case 'username':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {order.user.username}
          </Text>
        );

      case 'items':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {order.orderItems.reduce(
              (curr, next) => curr + next.orderedQuantity,
              0
            )}
          </Text>
        );

      case 'price':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {order.orderItems
              .reduce((curr: number, next) => {
                return curr + next.orderedQuantity * next.orderedPrice;
              }, 0)
              .toLocaleString('vi-VN')}
          </Text>
        );

      case 'method':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {order.paymentMethod}
          </Text>
        );

      case 'payment':
        return (
          <Badge
            isSquared
            variant='bordered'
            color={order.isPaid ? 'success' : 'error'}
          >
            {order.isPaid ? '???? thanh to??n' : 'ch??a thanh to??n'}
          </Badge>
        );

      case 'status':
        return (
          <Badge
            variant='flat'
            isSquared
            color={orderStatusColor(order.orderStatus)}
          >
            {orderStatus(order.orderStatus)}
          </Badge>
        );

      case 'date':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {new Date(order.createdDate).toLocaleString('vi-VN')}
          </Text>
        );

      default:
        return (
          <Row justify='center' align='center'>
            <Dropdown placement='bottom-right'>
              <Dropdown.Button
                ripple={false}
                css={{
                  background: '$gray100',
                  color: '$gray800',
                  '&:hover': {
                    background: '$gray200',
                  },
                  '&:active': {
                    background: '$gray300',
                  },
                  '&:focus': {
                    borderColor: '$gray400',
                  },
                }}
                flat
              ></Dropdown.Button>
              <Dropdown.Menu aria-label='Static Actions'>
                <Dropdown.Item key='edit' textValue='Chi ti???t'>
                  <Text
                    color='inherit'
                    onClick={() => router.push(`/admin/order/${order.id}`)}
                  >
                    Chi ti???t
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item key='delete' color='error' textValue='H???y'>
                  <Text color='inherit' onClick={() => handleCancle(order)}>
                    H???y
                  </Text>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        );
    }
  };

  return (
    <>
      <Table
        aria-label='Orders table'
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
        color='secondary'
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.uid}>{column.name}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={orders?.items || []}>
          {(item: OrderType) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {orders && (
        <Row justify='center' css={{ marginTop: 20, marginBottom: 20 }}>
          <Pagination
            shadow
            color='secondary'
            total={orders?.meta.totalPages}
            onChange={(page) => handleChange(page)}
            page={pageIndex}
          />
        </Row>
      )}
    </>
  );
};

export default IndexPage;
