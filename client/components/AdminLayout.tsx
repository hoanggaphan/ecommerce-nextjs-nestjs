import { Button, Card, Grid, Spacer, Text } from '@nextui-org/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { RiProductHuntLine } from 'react-icons/ri';

const SideBar = () => {
  const router = useRouter();

  return (
    <Card variant='bordered' css={{ $$cardColor: '$colors$white' }}>
      <Card.Body>
        <Button
          onPress={() => router.push('/admin')}
          icon={<AiOutlineHome />}
          css={{
            backgroundColor: router.pathname == '/admin' ? '#343e3e' : '',
          }}
          light={router.pathname == '/admin' ? false : true}
        >
          Trang chủ
        </Button>
        <Spacer y={1} />
        <Button
          onPress={() => router.push('/admin/category')}
          icon={<BiCategoryAlt />}
          light={router.pathname == '/admin/category' ? false : true}
          css={{
            backgroundColor:
              router.pathname == '/admin/category' ? '#343e3e' : '',
          }}
          ripple={false}
        >
          Danh mục
        </Button>
        <Spacer y={1} />
        <Button
          onPress={() => router.push('/admin/product')}
          icon={<RiProductHuntLine />}
          css={{
            backgroundColor:
              router.pathname == '/admin/product' ? '#343e3e' : '',
          }}
          light={router.pathname == '/admin/product' ? false : true}
          ripple={false}
        >
          Sản phẩm
        </Button>
        <Spacer y={1} />
        <Button
          onPress={() => router.push('/admin/order')}
          icon={<AiOutlineShoppingCart />}
          css={{
            backgroundColor: router.pathname == '/admin/order' ? '#343e3e' : '',
          }}
          light={router.pathname == '/admin/order' ? false : true}
          ripple={false}
        >
          Đơn hàng
        </Button>
        <Spacer y={1} />
        <Button
          onPress={() => router.push('/admin/employee')}
          icon={<HiOutlineUserGroup />}
          css={{
            backgroundColor:
              router.pathname == '/admin/employee' ? '#343e3e' : '',
          }}
          light={router.pathname == '/admin/employee' ? false : true}
          ripple={false}
        >
          Nhân viên
        </Button>
        <Spacer y={1} />
        <Button
          onPress={() => router.push('/admin/setting')}
          icon={<AiOutlineSetting />}
          css={{
            backgroundColor:
              router.pathname == '/admin/setting' ? '#343e3e' : '',
          }}
          light={router.pathname == '/admin/setting' ? false : true}
          ripple={false}
        >
          Cài đặt
        </Button>
      </Card.Body>
    </Card>
  );
};

interface Props {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: NextPage<Props> = ({ children, title }) => {
  return (
    <>
      <div className='container'>
        <Grid.Container gap={2} css={{ h: '100%' }}>
          <Grid xs={2} css={{ maxH: '100%', overflowY: 'auto' }}>
            <SideBar />
          </Grid>
          <Grid xs={10} css={{ maxH: '100%', overflowY: 'auto' }}>
            <div className='w100'>
              <Text h2>{title}</Text>
              {children}
            </div>
          </Grid>
        </Grid.Container>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default AdminLayout;
