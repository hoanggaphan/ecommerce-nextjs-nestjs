import { Button, Card, Grid, Input, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import Select, { components } from 'react-select';
import Swal from 'sweetalert2';
import AdminLayout from '../../../../components/common/AdminLayout';
import useAuth from '../../../../libs/hooks/useAuth';
import useRoles from '../../../../libs/hooks/useRoles';
import { useAdminUser } from '../../../../libs/swr/useAdminUser';
import {
  validateName,
  validatePassword,
  validatePhone,
} from '../../../../libs/validate';

export type InforFormValues = {
  fullName: string;
  address: string;
  phone: string;
};

export type AccountFormValues = {
  username: string;
  password: string;
  role: { value: string; label: string };
};

const rolesOptions = [
  {
    value: 'manager',
    label: 'Quản lý',
  },
  {
    value: 'employee',
    label: 'Nhân viên',
  },
];

export default function Add() {
  useAuth(true);
  useRoles(['admin', '/admin/dashboard']);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { data: user, mutate } = useAdminUser(id, session?.accessToken);

  const inforMethods = useForm<InforFormValues>();
  const accountMethods = useForm<AccountFormValues>();
  const username = accountMethods.watch('username');
  const password = accountMethods.watch('password');
  const phone = inforMethods.watch('phone');

  useEffect(() => {
    if (user) {
      inforMethods.setValue('fullName', user.fullName);
      inforMethods.setValue('address', user.address);
      inforMethods.setValue('phone', user.phone);

      accountMethods.setValue('username', user.username);
      accountMethods.setValue('password', (user as any).password);
      const defaultOpt =
        rolesOptions.find((o) => o.value === user.roles[0]) || rolesOptions[0];
      accountMethods.setValue('role', defaultOpt);
    }
  }, [user]);

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

  const phoneHelper = useMemo(() => {
    if (!phone)
      return {
        text: '',
        color: '',
      };
    const isValid = validatePhone(phone);
    return {
      isValid,
      text: isValid ? 'Correct phone' : 'Phone invalid',
      color: isValid ? 'success' : 'error',
    };
  }, [phone]);

  const onSubmitInfo: SubmitHandler<InforFormValues> = async (data) => {
    if (!phoneHelper.isValid) return;

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, data, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      await mutate();
      Swal.fire({
        title: 'Cập nhật thành công!',
        icon: 'success',
      });
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
        title: 'Cập nhật thất bại',
        icon: 'error',
      });
    }
  };

  const onSubmitAccount: SubmitHandler<AccountFormValues> = async (data) => {
    if (!nameHelper.isValid || !passHelper.isValid) return;

    const { role, ...restData } = data;
    const body = { ...restData, roles: [role.value] };

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/user/update-account/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      await mutate();
      Swal.fire({
        title: 'Cập nhật thành công!',
        icon: 'success',
      });
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
        title: 'Cập nhật thất bại',
        icon: 'error',
      });
    }
  };

  return (
    <>
      {' '}
      <Head>
        <title>Cập nhật nhân viên</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminLayout title='Cập nhật nhân viên'>
        <Grid.Container gap={2}>
          <Grid xs={12} sm={4}>
            <form
              style={{ width: '100%' }}
              onSubmit={inforMethods.handleSubmit(onSubmitInfo)}
            >
              <Card>
                <Card.Header>
                  <Text b>Thông tin</Text>
                </Card.Header>
                <Card.Body>
                  <Input
                    {...inforMethods.register('fullName')}
                    required
                    label='Họ tên'
                    placeholder='Nhập họ tên'
                    clearable
                  />
                  <Spacer y={1} />
                  <Input
                    {...inforMethods.register('address')}
                    required
                    label='Địa chỉ'
                    placeholder='Nhập địa chỉ'
                    clearable
                  />
                  <Spacer y={1} />
                  <Input
                    {...inforMethods.register('phone')}
                    required
                    label='Số điện thoại'
                    placeholder='Nhập số điện thoại'
                    clearable
                    status={phoneHelper.color as any}
                    color={phoneHelper.color as any}
                    helperColor={phoneHelper.color as any}
                    helperText={phoneHelper.text}
                    type='number'
                  />
                  <Spacer y={1} />
                  <Button type='submit' shadow auto color='secondary'>
                    Cập nhật
                  </Button>
                </Card.Body>
              </Card>
            </form>
          </Grid>
          <Grid xs={12} sm={4}>
            <FormProvider {...accountMethods}>
              <form
                style={{ width: '100%' }}
                onSubmit={accountMethods.handleSubmit(onSubmitAccount)}
              >
                <Card>
                  <Card.Header>
                    <Text b>Tài khoản</Text>
                  </Card.Header>
                  <Card.Body>
                    <Input
                      {...accountMethods.register('username')}
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
                      {...accountMethods.register('password')}
                      // required
                      type='password'
                      label='Mật khẩu'
                      placeholder='Nhập mật khẩu mới'
                      clearable
                      status={passHelper.color as any}
                      color={passHelper.color as any}
                      helperColor={passHelper.color as any}
                      helperText={passHelper.text}
                    />
                    <Spacer y={1} />
                    <Controller
                      name='role'
                      control={accountMethods.control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <SelectRole
                          options={rolesOptions}
                          value={field.value}
                          onChange={field.onChange}
                          innerRef={field.ref}
                        />
                      )}
                    />
                    <Spacer y={1} />
                    <Button type='submit' shadow auto color='secondary'>
                      Cập nhật
                    </Button>
                  </Card.Body>
                </Card>
              </form>
            </FormProvider>
          </Grid>
        </Grid.Container>
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
