import { globalCss, NextUIProvider } from '@nextui-org/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import RefreshTokenHandler from '../components/refreshTokenHandler';

const globalStyles = globalCss({
  body: { backgroundColor: '#f9f9f9' },
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
    <NextUIProvider>
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
