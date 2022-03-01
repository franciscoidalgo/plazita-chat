/* eslint-disable react/jsx-key */
import {
  Box,
  FormControl,
  Heading,
  Icon,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useAppProvider } from '../../context/AppContext';
import { FaArrowLeft } from 'react-icons/fa';
import { AiOutlineSend } from 'react-icons/ai';
import { getSender } from '../../models/Chat';
import { ProfileModal } from '../misc/ProfileModal';
import { MdClose } from 'react-icons/md';
import { Message } from '../../models/Message';
import axios from 'axios';
import { ScrollableChat } from './ScrollableChat';
import { Socket } from 'socket.io-client';
import { useSocketProvider } from '../../context/SocketContext';

interface Props {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<SetStateAction<boolean>>;
}

async function fetchMessages() {}

export const SingleChat: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState<string>();
  const [isListening, setIslistening] = useState(false);

  const socket: Socket | undefined = useSocketProvider();

  const { user, selectedChat, setSelectedChat } = useAppProvider();

  const toast = useToast();

  const handleMessage = (m: string) => {
    setNewMessage(m);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  const sendMessage = async () => {
    if (newMessage) {
      try {
        const messageToSend = `${newMessage}`;
        setNewMessage('');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        };

        const { data } = await axios.post(
          '/api/message',
          {
            content: messageToSend,
            chatId: selectedChat?._id,
          },
          config
        );

        socket?.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'An error has occurred',
          status: 'error',
          description: 'Failed to send the message',
          isClosable: true,
        });
      }
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/message?chatId=${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket?.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'An error has occurred',
        description: 'Failed to load the messages',
        status: 'error',
        isClosable: true,
      });
    }
  }, [selectedChat, toast, socket, user]);

  useEffect(() => {
    socket?.emit('setup', user);
  }, [socket, user]);

  useEffect(() => {
    if (!isListening) {
      socket?.on('message received', (newMessageReceived: Message) => {
        console.log(
          `Comparing ${selectedChat?._id} with ${newMessageReceived.chat._id}`
        );

        if (selectedChat && selectedChat._id !== newMessageReceived.chat._id) {
          // Notif
        } else {
          setMessages([...messages, newMessageReceived]);
        }
      });
      setIslistening(false);
    }
    return () => {
      socket?.off('message received');
    };
  }, [socket, selectedChat, messages, isListening]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, selectedChat]);

  return (
    <>
      {selectedChat ? (
        <Box display="flex" flexDirection="column" w="100%" h="100%">
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
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            backgroundColor="gray.900"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box
                display="flex"
                flexDir="column"
                overflowY="scroll"
                className="noScrollbar"
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl onKeyDown={handleKeyPress} mt={3} isRequired>
              <Box display="flex">
                <Input
                  variant="filled"
                  placeholder="Message"
                  value={newMessage}
                  onChange={(e) => handleMessage(e.target.value)}
                  mr={2}
                />
                <IconButton
                  aria-label="Send"
                  icon={<Icon as={AiOutlineSend} />}
                  borderRadius="full"
                  onClick={() => sendMessage()}
                />
              </Box>
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Heading>Click on a user to start chatting</Heading>
        </Box>
      )}
    </>
  );
};
