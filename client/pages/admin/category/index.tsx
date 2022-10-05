import {
  Button,
  Card,
  Col,
  Grid,
  Row,
  Spacer,
  styled,
  Table,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AdminLayout from '../../../components/AdminLayout';
import ValidateInput from '../../../components/ValidateInput';
import { validateName, validateSlug, validateURL } from '../../../lib/validate';

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

export const CellText = styled('div', {
  maxW: 200,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

type CategoryType = {
  id: string | number;
  name?: string;
  image?: string;
  slug?: string;
  description?: string;
};

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'TÊN', uid: 'name' },
  { name: 'SLUG', uid: 'slug' },
  { name: 'MÔ TẢ', uid: 'description' },
  { name: 'ACTIONS', uid: 'actions' },
];

const categories: CategoryType[] = [
  {
    id: 1,
    name: 'Tony Reichert',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 2,
    name: 'Zoey Lang',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 3,
    name: 'Jane Fisher',
    image: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 4,
    name: 'William Howard',
    image: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 5,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 6,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 7,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 8,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: 'slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
];

const renderCell = (user: CategoryType, columnKey: React.Key) => {
  switch (columnKey) {
    case 'id':
      return user?.id;
    case 'name':
      return user.name;
    case 'slug':
      return `/${user?.slug}`;
    case 'description':
      return <CellText>{user.description}</CellText>;

    case 'actions':
      return (
        <Row justify='center' align='center'>
          <Col css={{ d: 'flex' }}>
            <Tooltip content='Sửa'>
              <IconButton
                onClick={() => {
                  MySwal.fire({
                    title: 'Cập nhật',
                    text: 'Hành động này không thể hoàn tác!',
                    html: (
                      <Card>
                        <Card.Body>
                          <Spacer y={1} />
                          <ValidateInput
                            initialValue={user.name}
                            validate={validateName}
                            labelPlaceholder='Tên'
                            validText='Tên hợp lệ'
                            inValidText='Tên không hợp lệ'
                          />
                          <Spacer y={3} />
                          <ValidateInput
                            initialValue={user.slug}
                            validate={validateSlug}
                            labelPlaceholder='Slug'
                            validText='Slug hợp lệ'
                            inValidText='Slug không hợp lệ'
                          />
                          <Spacer y={3} />
                          <ValidateInput
                            initialValue={user.image}
                            validate={validateURL}
                            labelPlaceholder='Hình ảnh'
                            validText='Hình ảnh hợp lệ'
                            inValidText='Đường dẫn không hợp lệ'
                            type='url'
                          />
                          <Spacer y={3} />
                          <Textarea
                            labelPlaceholder='Mô tả'
                            rows={5}
                            initialValue={user.description}
                          />
                        </Card.Body>
                      </Card>
                    ),
                    showCancelButton: true,
                    confirmButtonText: 'Cập nhật!',
                    cancelButtonText: 'Đóng',
                    showLoaderOnConfirm: true,
                    preConfirm: (login) => {
                      return new Promise((resolve, reject) => {
                        setTimeout(() => {
                          resolve(true);
                        }, 1000);
                      });
                    },
                  }).then((result) => {
                    if (result.isConfirmed) {
                      console.log('Edit user', user?.id);

                      Swal.fire({
                        title: 'Cập nhật thành công!',
                        icon: 'success',
                      });
                    }
                  });
                }}
              >
                <AiOutlineEdit size={20} fill='#979797' />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: 'flex' }}>
            <Tooltip
              content='Xóa'
              color='error'
              onClick={() => {
                Swal.fire({
                  title: 'Bạn có chắc?',
                  text: 'Hành động này không thể hoàn tác!',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Xóa!',
                  cancelButtonText: 'Đóng',
                  showLoaderOnConfirm: true,
                  preConfirm: (login) => {
                    return new Promise((resolve, reject) => {
                      setTimeout(() => {
                        resolve(true);
                      }, 1000);
                    });
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    console.log(result.value); // result from ajax

                    Swal.fire({
                      title: 'Xóa thành công!',
                      icon: 'success',
                    });
                  }
                });
              }}
            >
              <IconButton>
                <AiOutlineDelete size={20} fill='#FF0080' />
              </IconButton>
            </Tooltip>
          </Col>
        </Row>
      );
  }
};

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Danh mục</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Thể loại'>
        <Grid.Container gap={2}>
          <Grid xs={3}>
            <Card>
              <Card.Body>
                <Spacer y={1} />
                <ValidateInput
                  validate={validateName}
                  labelPlaceholder='Tên'
                  validText='Tên hợp lệ'
                  inValidText='Tên không hợp lệ'
                />
                <Spacer y={3} />
                <ValidateInput
                  validate={validateSlug}
                  labelPlaceholder='Slug'
                  validText='Slug hợp lệ'
                  inValidText='Slug không hợp lệ'
                />
                <Spacer y={3} />
                <ValidateInput
                  validate={validateURL}
                  labelPlaceholder='Hình ảnh'
                  validText='Hình ảnh hợp lệ'
                  inValidText='Đường dẫn không hợp lệ'
                  type='url'
                />
                <Spacer y={3} />
                <Textarea labelPlaceholder='Mô tả' rows={4} />
                <Spacer y={1} />
                <Button shadow color='primary' auto>
                  Tạo danh mục
                </Button>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={9}>
            <div className='w100'>
              <Table
                aria-label='Category table'
                css={{
                  height: '460px',
                  minWidth: '100%',
                }}
                selectionMode='none'
              >
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Column
                      key={column.uid}
                      hideHeader={column.uid === 'actions'}
                      align={column.uid === 'actions' ? 'center' : 'start'}
                    >
                      {column.name}
                    </Table.Column>
                  )}
                </Table.Header>
                <Table.Body items={categories}>
                  {(item: CategoryType) => (
                    <Table.Row>
                      {(columnKey) => (
                        <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                      )}
                    </Table.Row>
                  )}
                </Table.Body>

                <Table.Pagination
                  shadow
                  noMargin
                  align='center'
                  rowsPerPage={5}
                  total={2}
                  onPageChange={(page) => console.log({ page })}
                />
              </Table>
            </div>
          </Grid>
        </Grid.Container>
      </AdminLayout>
    </>
  );
};

export default IndexPage;
