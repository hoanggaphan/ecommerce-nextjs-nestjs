import { Button, Link, Navbar, Text } from '@nextui-org/react';
import { NextPage } from 'next';
import { useCategory } from '../../libs/swr/useCategory';

interface Props {
  children: React.ReactNode;
}

const UserLayout: NextPage<Props> = ({ children }) => {
  const { data: category } = useCategory();

  return (
    <>
      <div style={{ backgroundColor: '#fdfdff' }}>
        <Navbar isBordered>
          <Navbar.Brand>
            {/* <AcmeLogo /> */}
            <Text b color='inherit' hideIn='xs'>
              ETOET
            </Text>
          </Navbar.Brand>
          <Navbar.Content
            enableCursorHighlight
            activeColor='secondary'
            hideIn='xs'
            variant='highlight-rounded'
          >
            {category?.map((item, i) => (
              <Navbar.Link key={i} href='#'>
                {item.name}
              </Navbar.Link>
            ))}
            {/* <Navbar.Link isActive href='#'> */}
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Link color='inherit' href='#'>
              Đăng nhập
            </Navbar.Link>
            <Navbar.Item>
              <Button color='secondary' auto flat as={Link} href='#'>
                Đăng ký
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
      </div>

      {children}
    </>
  );
};

export default UserLayout;
