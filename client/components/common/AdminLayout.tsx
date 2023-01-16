import { Button, Card, Grid, Navbar, Spacer, Text } from '@nextui-org/react';
import type { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineShoppingCart
} from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { GiFlowerTwirl } from 'react-icons/gi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { RiProductHuntLine } from 'react-icons/ri';
import { useBotChat } from './BotChat';
import Logo from './Logo';

const SideBar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Card variant='bordered' css={{ $$cardColor: '$colors$white' }}>
      <Card.Body>
        <Button
          onPress={() => router.push('/admin/dashboard')}
          icon={<AiOutlineHome />}
          css={{
            backgroundColor: router.pathname.includes('/admin/dashboard')
              ? '$secondary'
              : '',
          }}
          light={router.pathname.includes('/admin/dashboard') ? false : true}
          ripple={false}
        >
          Thống kê
        </Button>
        <Spacer y={1} />
        {session &&
          session.roles.some(
            (e: string) => e === 'admin' || e === 'manager'
          ) && (
            <>
              <Button
                onPress={() => router.push('/admin/category')}
                icon={<BiCategoryAlt />}
                light={
                  router.pathname.includes('/admin/category') ? false : true
                }
                css={{
                  backgroundColor: router.pathname.includes('/admin/category')
                    ? '$secondary'
                    : '',
                }}
                ripple={false}
              >
                Danh mục
              </Button>
              <Spacer y={1} />
            </>
          )}
        {session &&
          session.roles.some(
            (e: string) => e === 'admin' || e === 'manager'
          ) && (
            <>
              <Button
                onPress={() => router.push('/admin/attribute')}
                icon={<GiFlowerTwirl />}
                light={
                  router.pathname.includes('/admin/attribute') ? false : true
                }
                css={{
                  backgroundColor: router.pathname.includes('/admin/attribute')
                    ? '$secondary'
                    : '',
                }}
                ripple={false}
              >
                Thuộc tính
              </Button>
              <Spacer y={1} />
            </>
          )}
        {session &&
          session.roles.some(
            (e: string) => e === 'admin' || e === 'manager'
          ) && (
            <>
              <Button
                onPress={() => router.push('/admin/product')}
                icon={<RiProductHuntLine />}
                css={{
                  backgroundColor: router.pathname.includes('/admin/product')
                    ? '$secondary'
                    : '',
                }}
                light={
                  router.pathname.includes('/admin/product') ? false : true
                }
                ripple={false}
              >
                Sản phẩm
              </Button>
              <Spacer y={1} />
            </>
          )}
        <Button
          onPress={() => router.push('/admin/order')}
          icon={<AiOutlineShoppingCart />}
          css={{
            backgroundColor: router.pathname.includes('/admin/order')
              ? '$secondary'
              : '',
          }}
          light={router.pathname.includes('/admin/order') ? false : true}
          ripple={false}
        >
          Đơn hàng
        </Button>
        <Spacer y={1} />
        {session && session.roles.some((e: string) => e === 'admin') && (
          <>
            <Button
              onPress={() => router.push('/admin/employee')}
              icon={<HiOutlineUserGroup />}
              css={{
                backgroundColor: router.pathname.includes('/admin/employee')
                  ? '$secondary'
                  : '',
              }}
              light={router.pathname.includes('/admin/employee') ? false : true}
              ripple={false}
            >
              Nhân viên
            </Button>
            <Spacer y={1} />
          </>
        )}
        <Button
          onPress={() => router.push('/admin/setting')}
          icon={<AiOutlineSetting />}
          css={{
            backgroundColor: router.pathname.includes('/admin/setting')
              ? '$secondary'
              : '',
          }}
          light={router.pathname.includes('/admin/setting') ? false : true}
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
  useBotChat(false);

  const handleSignOut = () => {
    signOut({ redirect: false });
  };

  return (
    <>
      <div style={{ backgroundColor: '#fdfdff' }}>
        {' '}
        <Navbar isBordered>
          <Navbar.Brand>
            <Logo url='/admin/dashboard' />
          </Navbar.Brand>
          <Navbar.Content>
            <Navbar.Item>
              <Button onPress={handleSignOut} auto flat color='secondary'>
                Đăng xuất
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
      </div>
      <div className='container'>
        <Grid.Container gap={2}>
          <Grid xs={2} alignItems='baseline'>
            <SideBar />
          </Grid>
          <Grid xs={10}>
            <div className='w100'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text h2 color='secondary'>
                  {title}
                </Text>
              </div>
              {children}
            </div>
          </Grid>
        </Grid.Container>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default AdminLayout;
