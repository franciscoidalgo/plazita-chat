/* eslint-disable react/jsx-key */
import { Box, Heading, Icon, IconButton, Text } from '@chakra-ui/react';
import React, { SetStateAction } from 'react';
import { useAppProvider } from '../context/AppContext';
import { FaArrowLeft } from 'react-icons/fa';
import { getSender } from '../models/Chat';
import { ProfileModal } from './misc/ProfileModal';
import { MdClose } from 'react-icons/md';

interface Props {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<SetStateAction<boolean>>;
}

export const SingleChat: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useAppProvider();

  return (
    <>
      {selectedChat ? (
        <Box
          w="100%"
          display="flex"
          justifyContent={{ base: 'space-between' }}
          alignItems="center"
          mb={2}
        >
          <IconButton
            aria-label="Go back"
            display={{ base: 'flex', md: 'none' }}
            icon={<Icon as={FaArrowLeft} />}
            onClick={() => setSelectedChat(undefined)}
          />
          <Text fontSize={{ base: '28px', md: '30px' }} px={2}>
            {!selectedChat.isGroupChat && user ? (
              <>{getSender(user, selectedChat.users).name}</>
            ) : (
              <>{selectedChat.chatName.toUpperCase()}</>
            )}
          </Text>

          {selectedChat && !selectedChat.isGroupChat && user ? (
            <>
              <Box display={{ md: 'none' }}>
                <ProfileModal user={getSender(user, selectedChat.users)} />{' '}
              </Box>
              <IconButton
                aria-label="close"
                display={{ base: 'none', md: 'flex' }}
                icon={<Icon as={MdClose} />}
                onClick={() => setSelectedChat(undefined)}
              />
            </>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Heading>Click on a User to start chatting</Heading>
        </Box>
      )}
    </>
  );
};
