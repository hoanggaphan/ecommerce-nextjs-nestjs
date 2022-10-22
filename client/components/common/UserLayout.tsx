import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Navbar,
  Row,
  Spacer,
  Text
} from '@nextui-org/react';
import { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Key } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { HiOutlineUserCircle } from 'react-icons/hi';
import ScrollToTop from 'react-scroll-to-top';
import { selectTotalAmount } from '../../libs/redux/reducers/cartReducer';
import { useAppSelector } from '../../libs/redux/store';
import { useCategory } from '../../libs/swr/useCategory';
import Footer from './Footer';
import Logo from './Logo';

interface Props {
  children: React.ReactNode;
}

const Cart = () => {
  const totalAmount = useAppSelector(selectTotalAmount);

  return (
    <Badge color='secondary' content={totalAmount} shape='circle' size='sm'>
      <FaShoppingCart fill='#687076' size={25} />
    </Badge>
  );
};

const MyNavbar = () => {
  const { data: category } = useCategory();
  const router = useRouter();
  const { data: session } = useSession();

  const handleAction = (key: Key) => {
    if (key === 'logout') {
      console.log(key);
      signOut({ redirect: false });
    }
  };

  return (
    <div style={{ backgroundColor: '#fdfdff' }}>
      <Navbar isBordered>
        <Navbar.Brand>
          <Logo url='/' />
        </Navbar.Brand>
        <Navbar.Content
          enableCursorHighlight
          activeColor='secondary'
          hideIn='xs'
          variant='highlight-rounded'
        >
          {category?.map((item, i) => (
            <Link key={i} href={`/category/${item.slug}`}>
              <Navbar.Link
                isActive={router.asPath === `/category/${item.slug}`}
              >
                {item.name}
              </Navbar.Link>
            </Link>
          ))}
        </Navbar.Content>
        <Navbar.Content gap={15} css={{ w: 240, justifyContent: 'end' }}>
          {session ? (
            <Dropdown placement='bottom-right'>
              <Dropdown.Trigger>
                <Button
                  animated={false}
                  auto
                  style={{
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    padding: 0,
                    height: 'auto',
                  }}
                >
                  {session.avatar ? (
                    <Avatar
                      src='https://i.pravatar.cc/150?u=a042581f4e29026704d'
                      style={{
                        width: 30,
                        height: 30,
                        minWidth: 30,
                        minHeight: 30,
                      }}
                    />
                  ) : (
                    <HiOutlineUserCircle
                      color='#687076'
                      fontWeight={300}
                      size={30}
                    />
                  )}
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu
                onAction={handleAction}
                color='secondary'
                aria-label='Avatar Actions'
                disabledKeys={['profile']}
              >
                <Dropdown.Item
                  as='div'
                  aria-label='profile'
                  key='profile'
                  css={{ height: '$18' }}
                >
                  <Row align='center'>
                    {session.avatar ? (
                      <>
                        {' '}
                        <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026704d' />
                        <Text b css={{ ml: 10 }}>
                          {session.username}
                        </Text>
                      </>
                    ) : (
                      <>
                        <HiOutlineUserCircle size={40} color='#687076' />
                        <Text b color='#687076' css={{ ml: 10 }}>
                          {session.username}
                        </Text>
                      </>
                    )}
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item key='account' withDivider>
                  Tài khoản
                </Dropdown.Item>
                <Dropdown.Item key='orders_history'>
                  Lịch sử đặt hàng
                </Dropdown.Item>
                <Dropdown.Item key='logout' color='error' withDivider>
                  Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Link href={`/auth/login`}>
                <Navbar.Link color='inherit' href=''>
                  Đăng nhập
                </Navbar.Link>
              </Link>

              <Navbar.Item>
                <Button
                  onPress={() => router.push('/auth/register')}
                  color='secondary'
                  auto
                  flat
                >
                  Đăng ký
                </Button>
              </Navbar.Item>
            </>
          )}

          <Link href={`/cart`}>
            <Navbar.Link>
              <Cart />
            </Navbar.Link>
          </Link>
        </Navbar.Content>
      </Navbar>
    </div>
  );
};

const UserLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <MyNavbar />

      {children}

      <Spacer y={6} />
      <Footer />
      <ScrollToTop smooth color='#6f00ff' />
    </>
  );
};

export default UserLayout;
