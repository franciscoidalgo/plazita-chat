/* eslint-disable react/jsx-key */
import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AppProvider } from '../context/AppContext';
import '@fontsource/roboto/400.css';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SocketProvider } from '../context/SocketContext';
import customTheme from '../theme/theme';

let ENV = 'LOCAL';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', NProgress.start);
    router.events.on('routeChangeComplete', NProgress.done);

    return () => {
      router.events.off('routeChangeStart', NProgress.start);
      router.events.off('routeChangeComplete', NProgress.done);
      router.events.off('routeChangeError', NProgress.done);
    };
  }, [router]);

  return (
    <ChakraProvider theme={customTheme}>
      <SocketProvider
        socketApiServer={
          ENV === 'LOCAL'
            ? 'http://localhost:5000/'
            : 'https://plazita-chat.herokuapp.com/'
        }
      >
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </SocketProvider>
    </ChakraProvider>
  );
}

export default MyApp;
