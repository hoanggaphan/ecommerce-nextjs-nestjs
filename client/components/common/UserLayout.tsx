import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  FormElement,
  Input,
  Navbar,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, Key, useRef, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { RiSearchLine } from 'react-icons/ri';
import ScrollToTop from 'react-scroll-to-top';
import useMediaQuery from '../../libs/hooks/useMediaQuery';
import { selectTotalAmount } from '../../libs/redux/reducers/cartReducer';
import { useAppSelector } from '../../libs/redux/store';
import { useCategory } from '../../libs/swr/useCategory';
import { useProducts } from '../../libs/swr/useProducts';
import { BotChat, useBotChat } from './BotChat';
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

const Search = () => {
  const [focus, setFocus] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [temp, setTemp] = useState('');
  const timeoutRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const query = `?name=${keyword}`;
  const { data } = useProducts(query, !!keyword);
  const router = useRouter();

  const handleSubmit = async (e: React.KeyboardEvent<FormElement>) => {
    if (e.key === 'Enter') {
      router.push(`/search?key=${temp}`);
      setTemp('');
      setKeyword('');
      clearTimeout(timeoutRef.current);
      inputRef.current.blur();
    }
  };

  const handleChange = (e: ChangeEvent<FormElement>) => {
    const q = e.target.value;
    setTemp(q);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setKeyword(q);
    }, 500);
  };

  const renderList = () => {
    if (!data)
      return (
        <Row
          align='center'
          justify='center'
          css={{ h: '100%', p: 10, position: 'absolute' }}
        >
          <Text size={16}>Nhập tên sản phẩm cần tìm</Text>
        </Row>
      );

    if (data && data.items.length === 0)
      return (
        <Row
          align='center'
          justify='center'
          css={{ h: '100%', p: 10, position: 'absolute' }}
        >
          <Text size={16}>Không tìm thấy sản phẩm</Text>
        </Row>
      );

    return (
      <ul style={{ margin: 0, padding: 10 }}>
        {data?.items.map((i) => (
          <li key={i.id} className='result-item'>
            <Text
              onClick={() => router.push(`/${i.slug}`)}
              size={14}
              css={{
                padding: '8px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                wordBreak: 'break-word',
                cursor: 'pointer',
                transition: 'all.2s ease',
                '&:hover': {
                  background: 'rgba(17, 24,28,0.1)',
                },
                borderRadius: 4,
                userSelect: 'none',

                '&:active': {
                  transform: 'scale(.97)',
                },
              }}
            >
              {i.name}
            </Text>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className='search-container'>
        <Input
          ref={inputRef}
          value={temp}
          aria-labelledby='search'
          onKeyUp={handleSubmit}
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          clearable
          contentLeft={
            <RiSearchLine fill='var(--nextui-colors-accents6)' size={16} />
          }
          contentLeftStyling={false}
          css={{
            w: '100%',
            '@xsMax': {
              mw: '300px',
            },
            '& .nextui-input-content--left': {
              h: '100%',
              ml: '$4',
              dflex: 'center',
            },
          }}
          placeholder='Tìm kiếm...'
        />

        <div className={`search-result ${focus ? 'show' : ''}`}>
          {renderList()}
        </div>
      </div>
      <style jsx>{`
        .search-container {
          position: relative;
        }

        .search-result {
          width: 100%;
          max-height: calc(100vh - 334px);
          min-height: 168px;
          border-radius: 8px;

          z-index: 1001;
          margin-top: 7px;
          position: absolute;

          background: var(--nextui-colors-accents0);
          color: var(--nextui-colors-text);
          box-shadow: 0px 5px 20px -5px rgb(0 0 0 / 10%);

          overflow-y: auto;
          visibility: hidden;
          opacity: 0;
          transition: all 0.25s ease;
        }

        .search-result::-webkit-scrollbar {
          width: 0;
        }

        @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
          .search-result {
            backdrop-filter: saturate(180%) blur(10px) !important;
            background: rgba(236, 238, 240, 0.9);
          }
        }

        .show {
          visibility: visible;
          opacity: 1;
        }

        .result-item {
          margin-bottom: var(--nextui-space-5);
          font-size: var(--nextui-fontSizes-base);
          line-height: var(--nextui-lineHeights-lg);
        }
      `}</style>
    </>
  );
};

const MyNavbar = () => {
  const { data: category } = useCategory();
  const router = useRouter();
  const { data: session } = useSession();

  const handleAction = (key: Key) => {
    if (key === 'logout') {
      signOut({ redirect: false });
    } else if (key === 'my_orders') {
      router.push('/my-orders');
    } else if (key === 'profile') {
      router.push('/profile');
    } else if (key === 'update-password') {
      router.push('/update-password');
    }
  };

  const collapseItems = category ? category.map((i) => i.name) : [];
  const isXs = useMediaQuery('(min-width: 650px)');

  return (
    <>
      <Navbar>
        <Navbar.Brand>
          <Navbar.Toggle aria-label='toggle navigation' showIn='sm' />
          {isXs && <Logo url='/' />}
        </Navbar.Brand>
        <Navbar.Content
          enableCursorHighlight
          activeColor='secondary'
          hideIn='sm'
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
        <Navbar.Content gap={15} css={{ justifyContent: 'end' }}>
          <Navbar.Item
            css={{
              '@xsMax': {
                w: '100%',
                jc: 'center',
              },
            }}
          >
            <Search />
          </Navbar.Item>

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
                disabledKeys={['general']}
              >
                <Dropdown.Item
                  as='div'
                  aria-label='general'
                  key='general'
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
                <Dropdown.Item key='my_orders' withDivider>
                  Đơn hàng của tôi
                </Dropdown.Item>
                <Dropdown.Item key='profile'>Thông tin cá nhân</Dropdown.Item>
                <Dropdown.Item key='update-password'>
                  Cập nhật mật khẩu
                </Dropdown.Item>
                <Dropdown.Item key='logout' color='error' withDivider>
                  Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            isXs && (
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
            )
          )}

          <Link href={`/cart`}>
            <Navbar.Link>
              <Cart />
            </Navbar.Link>
          </Link>
        </Navbar.Content>

        <Navbar.Collapse>
          {collapseItems.map((item, index) => (
            <Navbar.CollapseItem key={item}>
              <Link
                style={{
                  minWidth: '100%',
                }}
                href={`/category/${item}`}
              >
                {item}
              </Link>
            </Navbar.CollapseItem>
          ))}
          <Navbar.CollapseItem>
            <Link
              style={{
                minWidth: '100%',
              }}
              href={`/auth/login`}
            >
              Đăng nhập
            </Link>
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <Link
              style={{
                minWidth: '100%',
              }}
              href={`/auth/register`}
            >
              Đăng ký
            </Link>
          </Navbar.CollapseItem>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

const UserLayout: NextPage<Props> = ({ children }) => {
  useBotChat(true);

  return (
    <>
      <MyNavbar />

      {children}

      <Spacer y={6} />
      <Footer />
      <ScrollToTop smooth color='#6f00ff' />
      <BotChat />

      <style jsx global>{`
        .scroll-to-top {
          right: 100px;
        }
      `}</style>
    </>
  );
};

export default UserLayout;
