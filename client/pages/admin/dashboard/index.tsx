import {
  Badge,
  Card,
  Dropdown,
  Grid,
  Row,
  Table,
  Text,
} from '@nextui-org/react';
import axios from 'axios';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Doughnut, Line } from 'react-chartjs-2';
import { FaBoxOpen } from 'react-icons/fa';
import { GiBeachBag } from 'react-icons/gi';
import { GrBitcoin } from 'react-icons/gr';
import useSWR from 'swr';
import AdminLayout from '../../../components/common/AdminLayout';
import { useAdminOrders } from '../../../libs/swr/useAdminOrders';
import { OrderType } from '../../../types';
import useAuth from '../../../libs/hooks/useAuth';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderOverview = () => {
  const { data: session } = useSession();
  const { data: overview } = useSWR<
    {
      orderStatus: string;
      total: string;
    }[]
  >(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/admin/order/overview`,
          session?.accessToken,
        ]
      : null,
    (url: string, token: string) =>
      axios
        .get(url, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((res) => res.data)
  );

  const defaultConfigs = [
    {
      orderStatus: 'cancel',
      total: '0',
    },
    {
      orderStatus: 'delivered',
      total: '0',
    },
    {
      orderStatus: 'processing',
      total: '0',
    },
    {
      orderStatus: 'refund',
      total: '0',
    },
    {
      orderStatus: 'delivering',
      total: '0',
    },
    {
      orderStatus: 'return',
      total: '0',
    },
  ];
  overview &&
    overview.forEach((o) => {
      const index = defaultConfigs.findIndex(
        (d) => d.orderStatus === o.orderStatus
      );
      defaultConfigs[index].total = o.total;
    });
  const labels = defaultConfigs.map((o) => orderStatus(o.orderStatus));
  const values = defaultConfigs.map((o) => o.total);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Doughnut
      options={{
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxHeight: 8,
            },
          },
        },
      }}
      data={data}
    />
  );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const SalesStatistic = () => {
  const { data: session } = useSession();
  const { data: sales } = useSWR<
    {
      method: string;
      month: number;
      total: string;
    }[]
  >(
    session?.accessToken
      ? [
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/admin/order/sales-statistic?year=${new Date().getFullYear()}`,
          session?.accessToken,
        ]
      : null,
    (url: string, token: string) =>
      axios
        .get(url, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((res) => res.data)
  );

  const colors = [
    {
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.2)',
    },
    {
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
    },
  ];
  let datasets: any = [];
  sales?.forEach((s) => {
    const label = s.method;
    const result = datasets.find((d: any) => d.label === label);
    if (!result) {
      datasets.push({
        fill: true,
        label,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      });
    }
  });
  datasets = datasets.map((d: any, i: number) => ({ ...d, ...colors[i] }));

  sales?.forEach((s) => {
    const label = s.method;
    const index = datasets.findIndex((d: any) => d.label === label);
    if (index !== -1) {
      datasets[index].data[s.month - 1] = s.total;
    }
  });

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return value.toLocaleString('vi-VN') + 'đ';
          },
        },
      },
    },

    interaction: {
      mode: 'index' as const,
      intersect: false,
    },

    tension: 0.4,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'start' as 'start',
        labels: {
          usePointStyle: true,
          boxHeight: 8,
        },
      },
    },
  };

  const labels = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const data = {
    labels,
    datasets,
  };
  return <Line options={options} data={data} />;
};

const columns = [
  { name: 'Mã đơn hàng', uid: 'id' },
  { name: 'Khách hàng', uid: 'customer' },
  { name: 'Tài khoản', uid: 'username' },
  { name: 'Mặt hàng', uid: 'items' },
  { name: 'Giá', uid: 'price' },
  { name: 'Phương thức', uid: 'method' },
  { name: 'Thanh toán', uid: 'payment' },
  { name: 'Trạng thái', uid: 'status' },
  { name: 'Ngày đặt', uid: 'date' },
  { name: 'hành động', uid: 'actions' },
];
const orderStatus = (status: string) => {
  if (status === 'processing') return 'đang xử lý';
  if (status === 'delivering') return 'đang vận chuyển';
  if (status === 'delivered') return 'đã giao hàng';
  if (status === 'refund') return 'hoàn tiền';
  if (status === 'return') return 'trả lại';
  return 'hủy';
};

const orderStatusColor = (status: string) => {
  if (status === 'processing') return 'warning';
  if (status === 'delivering') return 'primary';
  if (status === 'delivered') return 'success';
  if (status === 'return') return 'error';
  return 'default';
};
const LatestOrders = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: orders, mutate } = useAdminOrders(
    `?limit=5`,
    session?.accessToken
  );

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
            {order.isPaid ? 'đã thanh toán' : 'chưa thanh toán'}
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
                <Dropdown.Item key='edit' textValue='Chi tiết'>
                  <Text
                    color='inherit'
                    onClick={() => router.push(`/admin/order/${order.id}`)}
                  >
                    Chi tiết
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item key='delete' color='error' textValue='Hủy'>
                  <Text color='inherit' onClick={() => handleCancle(order)}>
                    Hủy
                  </Text>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        );
    }
  };

  return (
    <Table
      aria-label='Latest orders table'
      css={{
        height: 'auto',
        minWidth: '100%',
      }}
      color='secondary'
      shadow={false}
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
  );
};

type TopSelling = {
  name: string;
  sold: string;
};
const TopSellingProduct = () => {
  const { data: session } = useSession();
  const { data: topSelling } = useSWR<TopSelling[]>(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/admin/product/top-selling`,
          session?.accessToken,
        ]
      : null,
    (url: string, token: string) =>
      axios
        .get(url, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((res) => res.data)
  );

  return (
    <table aria-label='Top Selling table'>
      <tbody>
        {topSelling?.map((to) => (
          <tr key={to.name}>
            <td
              style={{
                width: '200px',
                borderBottom: '1px solid #f3f3f3',
                padding: '10px 0',
              }}
              className='line-clamp-2'
            >
              <Text b color='$accents9' size={15}>
                {to.name}
              </Text>
            </td>
            <td
              style={{ borderBottom: '1px solid #f3f3f3', padding: '10px 0' }}
            >
              <Text color='$accents7' size={15} css={{ textAlign: 'end' }}>
                {to.sold}
              </Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    // <div></div>
  );
};

const TotalRevenue = () => {
  const { data: session } = useSession();
  const { data } = useSWR<{
    totalRevenue: string;
  }>(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/admin/order/total-revenue`,
          session?.accessToken,
        ]
      : null,
    (url: string, token: string) =>
      axios
        .get(url, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((res) => res.data)
  );

  return (
    <div>
      <Text size='$xl' color='$accents8'>
        Tổng doanh thu
      </Text>
      <Text b size='$2xl' color='$accents9'>
        {data && Number(data.totalRevenue).toLocaleString('vi-VN')} VNĐ
      </Text>
    </div>
  );
};

const TotalOrders = () => {
  const { data: session } = useSession();
  const { data } = useSWR<string>(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/admin/order/total-order`,
          session?.accessToken,
        ]
      : null,
    (url: string, token: string) =>
      axios
        .get(url, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((res) => res.data)
  );

  return (
    <div>
      <Text size='$xl' color='$accents8'>
        Tổng đơn hàng
      </Text>
      <Text b size='$2xl' color='$accents9'>
        {data}
      </Text>
    </div>
  );
};

const TotalProduct = () => {
  const { data: session } = useSession();
  const { data } = useSWR<string>(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/admin/product/total-product`,
          session?.accessToken,
        ]
      : null,
    (url: string, token: string) =>
      axios
        .get(url, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((res) => res.data)
  );

  return (
    <div>
      <Text size='$xl' color='$accents8'>
        Tổng sản phẩm
      </Text>
      <Text b size='$2xl' color='$accents9'>
        {data}
      </Text>
    </div>
  );
};

const Admin: NextPage = () => {
  useAuth(true);

  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Thống kê'>
        <Grid.Container gap={2}>
          <Grid xs={4}>
            <Card css={{ h: '$24' }} variant='bordered'>
              <Card.Body>
                <Row align='center' css={{ h: '100%', columnGap: 10 }}>
                  <GrBitcoin
                    size={45}
                    fill='var(--nextui-colors-secondaryLightContrast)'
                  />
                  <TotalRevenue />
                </Row>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ h: '$24' }} variant='bordered'>
              <Card.Body>
                <Row align='center' css={{ h: '100%', columnGap: 10 }}>
                  <FaBoxOpen
                    size={45}
                    fill='var(--nextui-colors-secondaryLightContrast)'
                  />
                  <TotalOrders />
                </Row>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card css={{ h: '$24' }} variant='bordered'>
              <Card.Body>
                <Row align='center' css={{ h: '100%', columnGap: 10 }}>
                  <GiBeachBag
                    size={45}
                    fill='var(--nextui-colors-secondaryLightContrast)'
                  />
                  <TotalProduct />
                </Row>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={6}>
            <Card variant='bordered'>
              <Card.Header>
                <Text b size='$xl' color='$accents9'>
                  Thống kê bán hàng
                </Text>
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <SalesStatistic />
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={3}>
            <Card variant='bordered'>
              <Card.Header css={{ justifyContent: 'center' }}>
                <Text b size='$xl' color='$accents9'>
                  Tổng quan đơn hàng
                </Text>
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <OrderOverview />
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={3}>
            <Card variant='bordered'>
              <Card.Header css={{ justifyContent: 'center' }}>
                <Text b size='$xl' color='$accents9'>
                  Sản phẩm bán chạy
                </Text>
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <TopSellingProduct />
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card variant='bordered'>
              <Card.Header>
                <Text b size='$xl' color='$accents9'>
                  Đơn hàng mới nhất
                </Text>
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <LatestOrders />
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </AdminLayout>
    </>
  );
};

export default Admin;
