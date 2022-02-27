import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

interface Props {
  isLoading: boolean;
}

export const LoadingSpinner: React.FC<Props> = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100vw"
          h="100vh"
          top={0}
          left={0}
          position="fixed"
          zIndex={9999}
          backgroundColor="blackAlpha.800"
        >
          <Spinner size="xl" />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
