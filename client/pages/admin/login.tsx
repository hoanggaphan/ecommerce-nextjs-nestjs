import {
  Button,
  Card,
  Grid,
  Input,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';

export default function Login() {
  return (
    <Grid.Container css={{ h: '100vh' }} alignItems='center' justify='center'>
      <Grid justify='center'>
        <Card css={{ minWidth: '300px' }}>
          <Card.Header>
            <Text b>Đăng nhập</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: '$10' }}>
            <Spacer y={1} />
            <Input labelPlaceholder='Username' />
            <Spacer y={2} />
            <Input labelPlaceholder='Password' />
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify='center'>
              <Button size='sm'>Đăng nhập</Button>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
    </Grid.Container>
  );
}
