/* eslint-disable react/jsx-key */
import { Box } from '@chakra-ui/react';
import React, { SetStateAction } from 'react';
import { useAppProvider } from '../context/AppContext';
import { SingleChat } from './SingleChat';

interface Props {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<SetStateAction<boolean>>;
}

export const ChatBox: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useAppProvider();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems="center"
      flexDir="column"
      p={3}
      w={{ base: '100%', md: '68%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};
