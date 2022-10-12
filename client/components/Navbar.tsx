import { Button, Link, Navbar, Text } from '@nextui-org/react';

export default function MyNB() {
  return (
    <div>
      {' '}
      <Navbar isBordered>
        <Navbar.Brand>
          <Text b color='inherit' hideIn='xs'>
            ETOET
          </Text>
        </Navbar.Brand>
        <Navbar.Content>
          <Navbar.Item>
            <Button auto flat>
              Đăng xuất
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </div>
  );
}
