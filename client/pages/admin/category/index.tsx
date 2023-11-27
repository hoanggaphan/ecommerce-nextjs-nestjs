import {
  Badge,
  Col,
  Grid,
  Row,
  styled,
  Table,
  Tooltip,
} from '@nextui-org/react';
import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CategoryAddForm from '../../../components/CategoryAddForm';
import AdminLayout from '../../../components/common/AdminLayout';
import SweetHtmlCategory from '../../../components/SweetHtmlCategory';
import useAuth from '../../../libs/hooks/useAuth';
import useRoles from '../../../libs/hooks/useRoles';
import { useAdminCategory } from '../../../libs/swr/useAdminCategory';
import { validateName, validateSlug } from '../../../libs/validate';
import { CategoryType } from '../../../types';

const MySwal = withReactContent(Swal);

// IconButton component will be available as part of the core library soon
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

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'TÊN', uid: 'name' },
  { name: 'SLUG', uid: 'slug' },
  { name: 'HIỂN THỊ', uid: 'isActive' },
  { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

const IndexPage: NextPage = () => {
  useAuth(true);
  useRoles(['admin', 'manager'], '/admin/dashboard');
  const { data: session } = useSession();
  const { data, error, mutate } = useAdminCategory(session?.accessToken);

  const categories = data || [];

  const handleUpdateCategory = (category: CategoryType) => {
    MySwal.fire({
      title: 'Cập nhật',
      text: 'Hành động này không thể hoàn tác!',
      html: <SweetHtmlCategory category={category} />,
      showCancelButton: true,
      confirmButtonText: 'Cập nhật!',
      cancelButtonText: 'Đóng',
      preConfirm: async (login) => {
        const name = (
          document.getElementById('category-name') as HTMLInputElement
        )?.value;
        const slug = (
          document.getElementById('category-slug') as HTMLInputElement
        )?.value;
        const des = (
          document.getElementById('category-des') as HTMLInputElement
        )?.value;
        const isActive = (
          document.getElementById('category-active') as HTMLInputElement
        )?.checked;

        if (!name || !slug) return false;

        if (!validateName(name) || !validateSlug(slug)) return false;

        const data = {
          name,
          slug,
          description: des,
          isActive,
        };
        try {
          const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/category/${category.id}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
          return res;
        } catch (error: any) {
          Swal.showValidationMessage(error.response.data.message);
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        mutate();
        Swal.fire({
          title: 'Cập nhật thành công!',
          icon: 'success',
        });
      }
    });
  };

  const handleDeleteCategory = (id: number) => {
    Swal.fire({
      title: 'Bạn có chắc?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa!',
      cancelButtonText: 'Đóng',
      preConfirm: async (login) => {
        try {
          const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/category/${id}`,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
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

  const renderCell = (category: CategoryType, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return category?.id;
      case 'name':
        return category.name;
      case 'slug':
        return `/${category?.slug}`;
      case 'isActive':
        return category.isActive ? (
          <Badge color='secondary' variant='flat'>
            Đang hiển thị
          </Badge>
        ) : (
          <Badge color='error' variant='flat'>
            Chưa hiển thị
          </Badge>
        );

      case 'actions':
        return (
          <Row justify='center' align='center'>
            <Col css={{ d: 'flex' }}>
              <Tooltip content='Sửa'>
                <IconButton
                  type='button'
                  onClick={() => handleUpdateCategory(category)}
                >
                  <AiOutlineEdit size={20} fill='#979797' />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: 'flex' }}>
              <Tooltip
                content='Xóa'
                color='error'
                onClick={() => handleDeleteCategory(category.id)}
              >
                <IconButton type='button'>
                  <AiOutlineDelete size={20} fill='#FF0080' />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Danh mục</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Danh mục'>
        <Grid.Container gap={2}>
          <Grid xs={3}>
            <CategoryAddForm />
          </Grid>
          <Grid xs={9}>
            <div className='w100'>
              <Table
                aria-label='Category table'
                css={{
                  height: 'auto',
                  minWidth: '100%',
                }}
                selectionMode='none'
              >
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Column
                      key={column.uid}
                      // hideHeader={column.uid === 'actions'}
                      // align={column.uid === 'actions' ? 'center' : 'start'}
                    >
                      {column.name}
                    </Table.Column>
                  )}
                </Table.Header>
                <Table.Body items={categories}>
                  {(item: CategoryType) => (
                    <Table.Row>
                      {(columnKey) => (
                        <Table.Cell css={{ maxW: '150px' }}>
                          {renderCell(item, columnKey)}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  )}
                </Table.Body>

                {/* <Table.Pagination
                  shadow
                  noMargin
                  align='center'
                  rowsPerPage={5}
                  total={2}
                  onPageChange={(page) => console.log({ page })}
                /> */}
              </Table>
            </div>
          </Grid>
        </Grid.Container>
      </AdminLayout>
    </>
  );
};

export default IndexPage;
