import { Badge, Button, Navbar, Spacer } from '@nextui-org/react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaShoppingCart } from 'react-icons/fa';
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
    <Badge color='secondary' content={totalAmount} shape='circle'>
      <FaShoppingCart fill='#687076' size={30} />
    </Badge>
  );
};

const UserLayout: NextPage<Props> = ({ children }) => {
  const { data: category } = useCategory();
  const router = useRouter();

  return (
    <>
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
            {/* <Navbar.Link isActive href='#'> */}
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Link color='inherit' href=''>
              Đăng nhập
            </Navbar.Link>
            <Navbar.Item>
              <Button color='secondary' auto flat href='#'>
                Đăng ký
              </Button>
            </Navbar.Item>
            <Link href={`/cart`}>
              <Navbar.Link>
                <Cart />
              </Navbar.Link>
            </Link>
          </Navbar.Content>
        </Navbar>
      </div>

      {children}

      <Spacer y={6} />
      <Footer />
      <ScrollToTop smooth color='#6f00ff' />
    </>
  );
};

export default UserLayout;
