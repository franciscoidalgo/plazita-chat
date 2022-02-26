/* eslint-disable react/jsx-key */
import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AppProvider } from '../context/AppContext';
import '@fontsource/roboto';

const myTheme = extendTheme({
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
  },
  config: {
    initialColorMode: 'dark',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={myTheme}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
