import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { globalCss } from '@nextui-org/react';

const globalStyles = globalCss({
  body: { backgroundColor: '#f9f9f9' },
});

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <NextUIProvider>
      <Component {...pageProps} />
      <style jsx global>{`
        .w100 {
          width: 100%;
        }
      `}</style>
    </NextUIProvider>
  );
}

export default MyApp;
