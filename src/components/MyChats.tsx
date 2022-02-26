/* eslint-disable react/jsx-key */
import {
  Avatar,
  Box,
  Button,
  Icon,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import React, { SetStateAction, useEffect, useState } from 'react';
import { User } from '../models/User';
import { MdAddCircleOutline } from 'react-icons/md';
import { ChatLoading } from './ChatLoading';
import { useAppProvider } from '../context/AppContext';
import { getSender } from '../models/Chat';
import { ProfileModal } from './misc/ProfileModal';

interface Props {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<SetStateAction<boolean>>;
}

export const MyChats: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  // const [loggedUser, setLoggedUser] = useState<User>();
  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useAppProvider();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get('/api/chat/all', config);
      setChats(data);
    } catch (err) {
      const error = err as AxiosError;
      toast({
        title: 'An error has occurred',
        description: error.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="gray.700"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignContent="center"
      >
        My Chats
        <Button
          display="flex"
          fontSize={{ base: '17px', md: '10px', lg: '17px' }}
          rightIcon={<Icon as={MdAddCircleOutline} />}
        >
          New Group Chat
        </Button>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="gray.600"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack h="100%" overflowY="scroll" className="noScrollbar">
            {chats.map((c) => (
              <Box
                onClick={() => setSelectedChat(c)}
                cursor="pointer"
                bg={selectedChat === c ? 'teal' : 'gray.500'}
                px={3}
                py={2}
                h="8vh"
                borderRadius="lg"
                key={c._id}
                display="flex"
                flexDir="row"
              >
                {c.isGroupChat || !user ? (
                  <></>
                ) : (
                  <ProfileModal user={getSender(user, c.users)}>
                    <Avatar
                      size="md"
                      name={getSender(user, c.users).name}
                      src={getSender(user, c.users).picture}
                      mr={2}
                    />
                  </ProfileModal>
                )}
                <Text>
                  {c.isGroupChat
                    ? c.chatName
                    : user
                    ? getSender(user, c.users).name
                    : 'Error fetching current User data'}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
