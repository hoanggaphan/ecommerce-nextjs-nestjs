import {
  FormElement,
  Input,
  Row,
  styled,
  Table,
  Text,
  Tooltip,
  useInput,
} from '@nextui-org/react';
import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import {
  MdAddToPhotos,
  MdCatchingPokemon,
  MdOutlineDeleteSweep,
} from 'react-icons/md';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AdminLayout from '../../../components/common/AdminLayout';
import useRoles from '../../../libs/hooks/useRoles';
import { useAdminAttribute } from '../../../libs/swr/useAdminAttribute';
import { validateName } from '../../../libs/validate';
import { AttributeType, AttributeValues } from '../../../types';
import useAuth from '../../../libs/hooks/useAuth';

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

export const SendButton = styled('button', {
  // reset button styles
  background: 'transparent',
  border: 'none',
  padding: 0,
  // styles
  width: '24px',
  margin: '0 10px',
  dflex: 'center',
  bg: '$secondary',
  borderRadius: '$rounded',
  cursor: 'pointer',
  transition: 'opacity 0.25s ease 0s, transform 0.25s ease 0s',
  svg: {
    size: '100%',
    padding: '4px',
    transition: 'transform 0.25s ease 0s, opacity 200ms ease-in-out 50ms',
    boxShadow: '0 5px 20px -5px rgba(0, 0, 0, 0.1)',
  },
  '&:hover': {
    opacity: 0.8,
  },
  '&:active': {
    transform: 'scale(0.9)',
  },
});

const columns = [
  { name: 'TÊN', uid: 'name' },
  { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

const InputAdd = () => {
  useRoles(['admin', 'manager'], '/admin/dashboard');
  const { data: session } = useSession();
  const { mutate } = useAdminAttribute(session?.accessToken);
  const { value, reset, bindings } = useInput('');

  const handleEnter = async (e: React.KeyboardEvent<FormElement>) => {
    if (e.key === 'Enter') {
      try {
        const postData = { name: value };
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/attribute`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        Swal.fire({
          title: 'Tạo thành công!',
          icon: 'success',
        });
        await mutate();
        reset();
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
          });
          return;
        }
        Swal.fire({
          title: 'Tạo thất bại',
          icon: 'error',
        });
      }
    }
  };

  const handleClick = async () => {
    try {
      const postData = { name: value };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/attribute`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      Swal.fire({
        title: 'Tạo thành công!',
        icon: 'success',
      });
      await mutate();
      reset();
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Swal.fire({
          title: error.response.data.message,
          icon: 'error',
        });
        return;
      }
      Swal.fire({
        title: 'Tạo thất bại',
        icon: 'error',
      });
    }
  };

  return (
    <Input
      {...bindings}
      color='secondary'
      clearable
      bordered
      labelPlaceholder='Tạo thuộc tính'
      contentRightStyling={false}
      onKeyUp={(e) => handleEnter(e)}
      contentRight={
        <SendButton onClick={handleClick}>
          <MdCatchingPokemon color='white' />
        </SendButton>
      }
    />
  );
};

const IndexPage: NextPage = () => {
  useAuth(true);
  const { data: session } = useSession();
  const { data, mutate } = useAdminAttribute(session?.accessToken);
  const attributes = data || [];

  const createAttVal = (att: AttributeType) => {
    MySwal.fire({
      title: 'Thêm giá trị',
      html: (
        <div style={{ marginTop: 15 }}>
          <Input
            id='attribute-value-name'
            aria-labelledby='attribute-value-name'
            labelLeft='Tên'
            clearable
            css={{
              '& .nextui-input-label--left': {
                wordBreak: 'keep-all',
              },
            }}
          />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Thêm!',
      cancelButtonText: 'Đóng',
      preConfirm: async (login) => {
        const value = (
          document.getElementById('attribute-value-name') as HTMLInputElement
        )?.value;
        if (!value) return false;

        if (!validateName(value)) return false;

        const data = {
          value,
          attribute: {
            id: att.id,
          },
        };
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/attribute-value`,
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
          title: 'Thêm thành công!',
          icon: 'success',
        });
      }
    });
  };

  const updateAttVal = (att: AttributeValues) => {
    MySwal.fire({
      title: 'Cập nhật giá trị',
      html: (
        <div style={{ marginTop: 15 }}>
          <Input
            id='attribute-value-name'
            aria-labelledby='attribute-value-name'
            initialValue={att.value}
            labelLeft='Tên'
            clearable
            css={{
              '& .nextui-input-label--left': {
                wordBreak: 'keep-all',
              },
            }}
          />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Cập nhật!',
      cancelButtonText: 'Đóng',
      preConfirm: async (login) => {
        const value = (
          document.getElementById('attribute-value-name') as HTMLInputElement
        )?.value;
        if (!value) return false;

        if (!validateName(value)) return false;

        const data = {
          value,
        };
        try {
          const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/attribute-value/${att.id}`,
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

  const deleteAttVal = (id: number) => {
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
            `${process.env.NEXT_PUBLIC_API_URL}/admin/attribute-value/${id}`,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
          return res;
        } catch (error: any) {
          if (error.response.data.message) {
            return Swal.showValidationMessage(error.response.data.message);
          }
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

  const updateAttribute = (att: AttributeType) => {
    MySwal.fire({
      title: 'Cập nhật thuộc tính',
      html: (
        <div style={{ marginTop: 15 }}>
          <Input
            id='attribute-name'
            aria-labelledby='attribute-name'
            initialValue={att.name}
            labelLeft='Tên'
            clearable
            css={{
              '& .nextui-input-label--left': {
                wordBreak: 'keep-all',
              },
            }}
          />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Cập nhật!',
      cancelButtonText: 'Đóng',
      preConfirm: async (login) => {
        const name = (
          document.getElementById('attribute-name') as HTMLInputElement
        )?.value;
        if (!name) return false;

        if (!validateName(name)) return false;

        const data = {
          name,
        };
        try {
          const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/attribute/${att.id}`,
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

  const deleteAttribute = (id: number) => {
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
            `${process.env.NEXT_PUBLIC_API_URL}/admin/attribute/${id}`,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
          return res;
        } catch (error: any) {
          if (error.response.data.message) {
            return Swal.showValidationMessage(error.response.data.message);
          }
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

  const renderCell = (
    attributeValues: AttributeValues,
    columnKey: React.Key
  ) => {
    switch (columnKey) {
      case 'name':
        return attributeValues.value;
      case 'actions':
        return (
          <Row justify='space-around' align='center'>
            <Tooltip content='Sửa'>
              <IconButton
                onClick={() => {
                  updateAttVal(attributeValues);
                }}
              >
                <AiOutlineEdit size={18} fill='#979797' />
              </IconButton>
            </Tooltip>
            <Tooltip content='Xóa' color='error'>
              <IconButton
                onClick={(e) => {
                  deleteAttVal(attributeValues.id);
                }}
              >
                <MdOutlineDeleteSweep size={18} fill='#FF0080' />
              </IconButton>
            </Tooltip>
          </Row>
        );
    }
  };

  return (
    <>
      <>
        <Head>
          <title>Danh mục</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <AdminLayout title='Thuộc tính'>
          <div style={{ marginTop: 20 }}>
            <InputAdd />
          </div>

          <div style={{ marginTop: 20 }} className='items'>
            {attributes?.map((at) => (
              <div key={at.id + at.name} className='item w100'>
                <Row align='center' css={{ columnGap: 10 }}>
                  <Text h3 css={{ color: '$accents7', mb: 0 }}>
                    {at.name}
                  </Text>

                  <Tooltip content='Thêm'>
                    <IconButton onClick={() => createAttVal(at)}>
                      <MdAddToPhotos size={18} fill='#979797' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content='Sửa'>
                    <IconButton onClick={() => updateAttribute(at)}>
                      <AiOutlineEdit size={18} fill='#979797' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content='Xóa' color='error'>
                    <IconButton onClick={() => deleteAttribute(at.id)}>
                      <MdOutlineDeleteSweep size={18} fill='#FF0080' />
                    </IconButton>
                  </Tooltip>
                </Row>
                <Table
                  bordered
                  shadow={false}
                  aria-label='Category table'
                  css={{
                    height: 'auto',
                    minWidth: '100%',
                  }}
                  selectionMode='none'
                >
                  <Table.Header columns={columns}>
                    {(column) => (
                      <Table.Column key={column.uid}>
                        {column.name}
                      </Table.Column>
                    )}
                  </Table.Header>
                  <Table.Body items={at.attributeValues}>
                    {(item: AttributeValues) => (
                      <Table.Row>
                        {(columnKey) => (
                          <Table.Cell css={{ maxW: '150px' }}>
                            {renderCell(item, columnKey)}
                          </Table.Cell>
                        )}
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            ))}
          </div>
        </AdminLayout>
      </>
      <style jsx>{`
        .items {
          column-count: 6;
          column-gap: 10px;
        }
        .item {
          break-inside: avoid;
        }
      `}</style>
    </>
  );
};

export default IndexPage;
