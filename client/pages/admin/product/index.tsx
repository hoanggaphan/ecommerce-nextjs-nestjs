import {
  Badge,
  Button,
  Dropdown,
  FormElement,
  Input,
  Pagination,
  Row,
  styled,
  Table,
  Text,
  User,
} from '@nextui-org/react';
import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, memo, SetStateAction, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../../../components/common/AdminLayout';
import useAuth from '../../../libs/hooks/useAuth';
import useRoles from '../../../libs/hooks/useRoles';
import { useAdminProducts } from '../../../libs/swr/useAdminProducts';
import { ImageType, ProductType } from '../../../types';

const columns = [
  { name: 'Sản phẩm', uid: 'product' },
  { name: 'Kho', uid: 'stock' },
  { name: 'Danh mục', uid: 'category' },
  { name: 'Trạng thái', uid: 'status' },
  { name: 'hành động', uid: 'actions' },
];

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

const deleteImg = async (imgId: string) => {
  return await axios
    .delete('/api/images/' + imgId)
    .then((res: any) => res.data);
};

const deleteImgsFromCloud = async (images: ImageType[]) => {
  return await Promise.all(images.map((img) => deleteImg(img.publicId)));
};

const IndexPage: NextPage = () => {
  useAuth(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [temp, setTemp] = useState('');
  const router = useRouter();

  const handleEnter = async (e: React.KeyboardEvent<FormElement>) => {
    if (e.key === 'Enter') {
      setKeyword(temp);
    }
  };

  const handleChange = (e: ChangeEvent<FormElement>) => setTemp(e.target.value);

  return (
    <>
      <>
        <Head>
          <title>Sản phẩm</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <AdminLayout title='Sản phẩm'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Input
              onChange={handleChange}
              onKeyUp={handleEnter}
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
    </>
  );
};

const Page = memo(
  ({
    keyword,
    pageIndex,
    setPageIndex,
  }: {
    keyword: string;
    pageIndex: number;
    setPageIndex: Dispatch<SetStateAction<number>>;
  }) => {
    useRoles(['admin', 'manager', '/admin/dashboard']);
    const router = useRouter();
    const { data: session } = useSession();
    const { data: products, mutate } = useAdminProducts(
      `?limit=20&page=${pageIndex}&name=${keyword}`,
      session?.accessToken
    );

    const handleDelete = async (id: number, images: ImageType[]) => {
      Swal.fire({
        title: 'Bạn có chắc?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa!',
        cancelButtonText: 'Đóng',
        preConfirm: async (login) => {
          try {
            await deleteImgsFromCloud(images);
            const res = await axios.delete(
              `${process.env.NEXT_PUBLIC_API_URL}/admin/product/${id}`,
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

    const renderCell = (product: ProductType, columnKey: React.Key) => {
      switch (columnKey) {
        case 'product':
          return (
            <User
              squared
              src={product.images.length > 0 ? product.images[0].url : ''}
              name={product.name}
              css={{ p: 0 }}
            />
          );

        case 'stock':
          return (
            <Text b size={13} css={{ color: '$accents7' }}>
              {product.variants.reduce((curr, next) => curr + next.quantity, 0)}{' '}
              sản phẩm của {product.variants.length} loại
            </Text>
          );

        case 'category':
          return (
            <Text b size={13} css={{ tt: 'capitalize', color: '$accents7' }}>
              {product.category.name}
            </Text>
          );

        case 'status':
          return (
            <Row>
              {product.isNew && (
                <Badge variant='flat' isSquared color='secondary'>
                  Mới
                </Badge>
              )}
              {product.isPopular && (
                <Badge variant='flat' isSquared color='secondary'>
                  Nổi bật
                </Badge>
              )}
              {product.isActive ? (
                <Badge variant='flat' isSquared color='secondary'>
                  Đang hiển thị
                </Badge>
              ) : (
                <Badge variant='flat' isSquared color='error'>
                  Chưa hiển thị
                </Badge>
              )}
              {product.category === null && (
                <Badge variant='flat' isSquared color='error'>
                  Chưa có danh mục
                </Badge>
              )}
            </Row>
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
                  <Dropdown.Item key='edit' textValue='Sửa'>
                    <Text
                      color='inherit'
                      onClick={() => {
                        router.push('/admin/product/update/' + product.id);
                      }}
                    >
                      Sửa
                    </Text>
                  </Dropdown.Item>
                  <Dropdown.Item key='delete' color='error' textValue='Xóa'>
                    <Text
                      color='inherit'
                      onClick={(e) => {
                        handleDelete(product.id, product.images);
                      }}
                    >
                      Xóa
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
          aria-label='Example table with custom cells'
          css={{
            height: 'auto',
            minWidth: '100%',
          }}
          color='secondary'
          selectionMode='multiple'
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.uid}>{column.name}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={products?.items || []}>
            {(item: ProductType) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        {products && (
          <Row justify='center' css={{ marginTop: 20, marginBottom: 20 }}>
            <Pagination
              shadow
              color='secondary'
              total={products?.meta.totalPages}
              onChange={(page) => handleChange(page)}
              page={pageIndex}
            />
          </Row>
        )}
      </>
    );
  }
);

export default IndexPage;
