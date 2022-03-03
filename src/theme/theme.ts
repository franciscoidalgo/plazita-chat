import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
  },
  config: {
    initialColorMode: 'dark',
  },
});

export default customTheme;
