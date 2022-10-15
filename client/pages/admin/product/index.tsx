import {
  Badge,
  Button,
  Card,
  Grid,
  Input,
  Pagination,
  Row,
  styled,
  Text,
} from '@nextui-org/react';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../../../components/common/AdminLayout';
import SecureAdminPages from '../../../components/SecureAdminPages';
import { useAdminProducts } from '../../../libs/swr/useAdminProducts';
import api from './../../../libs/api';

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
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const { data: session } = useSession();
  const { data, error, mutate } = useAdminProducts(
    `?limit=12&page=${pageIndex}`,
    session?.accessToken
  );

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Bạn có chắc?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa!',
      cancelButtonText: 'Đóng',
      preConfirm: async (login) => {
        try {
          const res = await api.delete(`http://localhost:4000/product/${id}`);
          return res;
        } catch (error: any) {
          Swal.showValidationMessage(`Xóa thất bại`);
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value?.status == 200) {
        Swal.fire({
          title: 'Xóa thành công!',
          icon: 'success',
        });
        const res: any = await mutate();
        if (res.meta.itemCount === 0 && pageIndex > 1) {
          setPageIndex(pageIndex - 1);
        }
      }
    });
  };

  const handleChange = (page: number) => {
    setPageIndex(page);
  };

  return (
    <SecureAdminPages>
      <>
        <Head>
          <title>Sản phẩm</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <AdminLayout title='Sản phẩm'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Input
              aria-label='product-search'
              placeholder='Tìm kiếm'
              size='lg'
            />
            <Button
              onPress={() => router.push('/admin/product/add')}
              shadow
              color='secondary'
            >
              Tạo mới
            </Button>
          </div>

          <div style={{ minHeight: 437, marginTop: 20 }}>
            <Grid.Container gap={1}>
              {data?.items.map((i) => (
                <Grid key={i.id} xs={6} sm={4} md={3} lg={2}>
                  <Card variant='bordered' css={{ mw: '330px' }}>
                    <Card.Header
                      css={{
                        flexWrap: 'wrap',
                        minHeight: 80,
                        alignItems: 'baseline',
                      }}
                    >
                      {i.isNew && (
                        <Badge variant='flat' isSquared color='secondary'>
                          Mới
                        </Badge>
                      )}
                      {i.isPopular && (
                        <Badge variant='flat' isSquared color='secondary'>
                          Nổi bật
                        </Badge>
                      )}
                      {i.isActive ? (
                        <Badge variant='flat' isSquared color='secondary'>
                          Đang hiển thị
                        </Badge>
                      ) : (
                        <Badge variant='flat' isSquared color='error'>
                          Chưa hiển thị
                        </Badge>
                      )}
                    </Card.Header>
                    <Card.Body css={{ p: 0 }}>
                      <Card.Image
                        src={i.images[0].url}
                        width='100%'
                        height={140}
                        alt=''
                      />
                    </Card.Body>
                    <Card.Body>
                      <Text
                        b
                        css={{
                          fontSize: 18,
                          textAlign: 'center',
                          minHeight: 54,
                        }}
                      >
                        {i.name}
                      </Text>
                      <Text
                        b
                        color='secondary'
                        css={{ fontSize: 18, textAlign: 'center' }}
                      >
                        {i.price.toLocaleString('vi-VN')} đ
                      </Text>
                      <Text
                        b
                        color=''
                        css={{ fontSize: 14, textAlign: 'center' }}
                      >
                        Số lượng: {i.quantity}
                      </Text>
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer>
                      <div style={{ width: '100%' }}>
                        <Row justify='space-between'>
                          <Button
                            onPress={() =>
                              router.push('/admin/product/update/' + i.id)
                            }
                            size='xs'
                            color='secondary'
                            flat
                          >
                            Sửa
                          </Button>
                          <Button
                            onPress={() => handleDelete(i.id)}
                            size='xs'
                            color='secondary'
                          >
                            Xóa
                          </Button>
                        </Row>
                      </div>
                    </Card.Footer>
                  </Card>
                </Grid>
              ))}
            </Grid.Container>
          </div>

          {data && data?.meta.totalPages > 1 && (
            <Row justify='center' css={{ marginTop: 20, marginBottom: 20 }}>
              <Pagination
                shadow
                color='secondary'
                total={data?.meta.totalPages}
                onChange={(page) => handleChange(page)}
                page={pageIndex}
              />
            </Row>
          )}
        </AdminLayout>
      </>
    </SecureAdminPages>
  );
};

export default IndexPage;
