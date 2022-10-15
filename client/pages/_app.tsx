import { globalCss, NextUIProvider } from '@nextui-org/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import RefreshTokenHandler from '../components/refreshTokenHandler';
import { theme } from '../libs/theme';

const globalStyles = globalCss({
  body: { backgroundColor: '#f5f7fa' },
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const [interval, setInterval] = useState(0);
  globalStyles();

  return (
    <NextUIProvider theme={theme}>
      <SessionProvider session={pageProps.session} refetchInterval={interval}>
        <Component {...pageProps} />
        <RefreshTokenHandler setInterval={setInterval} />
      </SessionProvider>
      <style jsx global>{`
        .w100 {
          width: 100%;
        }
      `}</style>
    </NextUIProvider>
  );
}

export default MyApp;
