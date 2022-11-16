import { globalCss, NextUIProvider } from '@nextui-org/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RefreshTokenHandler from '../components/refreshTokenHandler';
import { persistor, store } from '../libs/redux/store';
import { theme } from '../libs/theme';
import NextNProgress from 'nextjs-progressbar';

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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider theme={theme}>
          <SessionProvider
            session={pageProps.session}
            refetchInterval={interval}
          >
            <NextNProgress color='#BC8EE9' height={4} />
            <Component {...pageProps} />
            <RefreshTokenHandler setInterval={setInterval} />
          </SessionProvider>
          <style jsx global>{`
            .w100 {
              width: 100%;
            }
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `}</style>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
