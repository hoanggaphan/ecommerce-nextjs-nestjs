import { Button, Card, Grid, Input, Spacer } from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useMemo } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import Select, { components } from 'react-select';
import Swal from 'sweetalert2';
import AdminLayout from '../../../components/common/AdminLayout';
import useAuth from '../../../libs/hooks/useAuth';
import useRoles from '../../../libs/hooks/useRoles';
import { validateName, validatePassword } from '../../../libs/validate';

export type FormValues = {
  username: string;
  password: string;
  role: { value: string; label: string };
};

export default function Add() {
  useAuth(true);
  useRoles(['admin', '/admin/dashboard']);
  const { data: session } = useSession();

  const options = [
    {
      value: 'manager',
      label: 'Quản lý',
    },
    {
      value: 'employee',
      label: 'Nhân viên',
    },
  ];

  const methods = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: '',
      role: options[0],
    },
  });
  const username = methods.watch('username');
  const password = methods.watch('password');

  const nameHelper = useMemo(() => {
    if (!username)
      return {
        text: '',
        color: '',
      };
    const isValid = username.length >= 6 && validateName(username);
    return {
      isValid,
      text: isValid
        ? 'Correct name'
        : 'Username must contains at least 6 letter, no space, no special letters',
      color: isValid ? 'success' : 'error',
    };
  }, [username]);

  const passHelper = useMemo(() => {
    if (!password)
      return {
        text: '',
        color: '',
      };
    const isValid = password.length >= 6 && validatePassword(password);
    return {
      isValid,
      text: isValid
        ? 'Correct password'
        : 'Password must contains at least 6 letter, 1 number, uppercase letter',
      color: isValid ? 'success' : 'error',
    };
  }, [password]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!nameHelper.isValid || !passHelper.isValid) return;

    const { role, ...restData } = data;
    const body = { ...restData, roles: [role.value] };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/user`, body, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      Swal.fire({
        title: 'Thêm thành công!',
        icon: 'success',
      });
      methods.reset();
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
        title: 'Thêm thất bại',
        icon: 'error',
      });
    }
  };

  return (
    <>
      {' '}
      <Head>
        <title>Thêm nhân viên</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminLayout title='Thêm nhân viên'>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Grid.Container>
              <Grid xs={12} sm={4}>
                <Card>
                  <Card.Body>
                    <Input
                      {...methods.register('username')}
                      required
                      label='Tài khoản'
                      placeholder='Nhập tài khoản'
                      clearable
                      status={nameHelper.color as any}
                      color={nameHelper.color as any}
                      helperColor={nameHelper.color as any}
                      helperText={nameHelper.text}
                    />
                    <Spacer y={1} />
                    <Input.Password
                      {...methods.register('password')}
                      required
                      type='password'
                      label='Mật khẩu'
                      placeholder='Nhập mật khẩu'
                      clearable
                      status={passHelper.color as any}
                      color={passHelper.color as any}
                      helperColor={passHelper.color as any}
                      helperText={passHelper.text}
                    />
                    <Spacer y={1} />
                    <Controller
                      name='role'
                      control={methods.control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <SelectRole
                          options={options}
                          value={field.value}
                          onChange={field.onChange}
                          innerRef={field.ref}
                        />
                      )}
                    />

                    <Spacer y={1} />
                    <Button type='submit' shadow auto color='secondary'>
                      Thêm
                    </Button>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid.Container>
          </form>
        </FormProvider>
      </AdminLayout>
    </>
  );
}

const SelectRole = (props: any) => {
  return (
    <Select
      {...props}
      placeholder='Chọn thành phố'
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
      components={{
        Control: (base) => (
          <>
            <label
              style={{
                fontSize: 14,
                marginBottom: 6,
                display: 'block',
              }}
            >
              Vai trò
            </label>
            <components.Control {...base} />
          </>
        ),
      }}
      styles={{
        container: (base) => ({
          ...base,
          width: '100%',
        }),
        control: (base) => ({
          ...base,
          background: '#F1F3F5',
          border: 'none',
          borderColor: 'none',
          borderRadius: 12,
          minHeight: 40,
          boxShadow: 'none',
        }),
        menu: (base) => ({
          ...base,
          background: '#fff',
          fontSize: 14,
          borderRadius: 12,
          overflow: 'hidden',
        }),
        menuList: (base) => ({
          ...base,
        }),
        valueContainer: (base) => ({
          ...base,
          fontSize: 14,
        }),
        option: (styles: any, { isSelected }: any) => ({
          ...styles,
          backgroundColor: isSelected ? '#7828C8' : null,
          color: isSelected ? 'white' : null,
          ':hover': {
            backgroundColor: isSelected ? null : '#EADCF8',
            color: isSelected ? null : '#7828C8',
          },
          ':active': {
            backgroundColor: null,
            color: null,
          },
        }),
      }}
    />
  );
};
