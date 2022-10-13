import {
  Button,
  Card,
  Grid,
  Input,
  Row,
  styled,
  Text
} from '@nextui-org/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import AdminLayout from '../../../components/common/AdminLayout';
import SecureAdminPages from '../../../components/SecureAdminPages';
import { useProducts } from '../../../libs/swr/useProducts';
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
  const { data, error, mutate } = useProducts();

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
    }).then((result) => {
      if (result.isConfirmed && result.value?.status == 200) {
        Swal.fire({
          title: 'Xóa thành công!',
          icon: 'success',
        });
        mutate();
      }
    });
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
              color='primary'
            >
              Tạo mới
            </Button>
          </div>

          <Grid.Container gap={1}>
            {data?.map((i) => (
              <Grid key={i.id} xs={6} sm={4} md={3} lg={2}>
                <Card variant='bordered' css={{ mw: '330px' }}>
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      src={i.images[0].url}
                      width='100%'
                      height={140}
                      alt=''
                    />
                  </Card.Body>
                  <Card.Footer>
                    <div className=''>
                      <Text css={{ fontSize: 18 }}>{i.name}</Text>
                      <Row justify='space-between'>
                        <Button
                          onPress={() =>
                            router.push('/admin/product/update/' + i.id)
                          }
                          size='xs'
                          color='secondary'
                          shadow
                        >
                          Sửa
                        </Button>
                        <Button
                          onPress={() => handleDelete(i.id)}
                          size='xs'
                          color='error'
                          shadow
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
          {/* <Row justify='center'>
          <Pagination shadow color='primary' total={10} />
        </Row> */}
        </AdminLayout>
      </>
    </SecureAdminPages>
  );
};

export default IndexPage;
