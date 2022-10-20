import { Text } from '@nextui-org/react';

export default function Custom404() {
  return (
    <div
      style={{
        height: 'calc(100vh)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Text h1 color='secondary'>
        404
      </Text>
      <Text h2 color='secondary'>
        NOT FOUND
      </Text>
    </div>
  );
}
