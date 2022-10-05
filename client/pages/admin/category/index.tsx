import {
  Button,
  Card,
  Col,
  Grid,
  Input,
  Pagination,
  Row,
  Spacer,
  styled,
  Table,
  Textarea,
  Tooltip,
  User,
} from '@nextui-org/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import AdminLayout from '../../../components/AdminLayout';

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
  fontSize: 13,
  fontWeight: 600,
  color: '$accents7',
  maxW: 200,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

type UserType = {
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

const users: UserType[] = [
  {
    id: 1,
    name: 'Tony Reichert',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 2,
    name: 'Zoey Lang',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 3,
    name: 'Jane Fisher',
    image: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 4,
    name: 'William Howard',
    image: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 5,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 6,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 7,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
  {
    id: 8,
    name: 'Kristen Copper',
    image: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    slug: '/slug',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam consequuntur similique sapiente. Aliquid architecto, vero voluptates rerum quisquam, dolore repudiandae nemo a vel debitis maiores accusantium harum magni est illum!',
  },
];

const renderCell = (user: UserType, columnKey: React.Key) => {
  switch (columnKey) {
    case 'id':
      return user?.id;
    case 'name':
      return (
        <User squared src={user?.image} name={user.name} css={{ p: 0 }}></User>
      );
    case 'slug':
      return <CellText>{user?.slug}</CellText>;
    case 'description':
      return <CellText>{user.description}</CellText>;

    case 'actions':
      return (
        <Row justify='center' align='center'>
          <Col css={{ d: 'flex' }}>
            <Tooltip content='Details'>
              <IconButton onClick={() => console.log('View user', user?.id)}>
                <AiOutlineEye size={20} fill='#979797' />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: 'flex' }}>
            <Tooltip content='Edit user'>
              <IconButton onClick={() => console.log('Edit user', user?.id)}>
                <AiOutlineEdit size={20} fill='#979797' />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: 'flex' }}>
            <Tooltip
              content='Delete user'
              color='error'
              onClick={() => console.log('Delete user', user?.id)}
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
                <Input labelPlaceholder='Tên' clearable />
                <Spacer y={2} />
                <Input labelPlaceholder='Slug' clearable />
                <Spacer y={2} />
                <Input labelPlaceholder='Hình ảnh' clearable />
                <Spacer y={2} />
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
                <Table.Body items={users}>
                  {(item: UserType) => (
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
