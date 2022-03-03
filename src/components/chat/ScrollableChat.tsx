import { Box, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { useAppProvider } from '../../context/AppContext';
import { Message } from '../../models/Message';

interface Props {
  messages: Message[];
}

export const ScrollableChat: React.FC<Props> = ({ messages }) => {
  const { user } = useAppProvider();

  const getDateString = (d: string) => {
    const date = new Date(d);
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <Box key={message._id} display="flex" p={1}>
            <Box
              key={`${message._id}__mb`}
              backgroundColor={
                message.sender._id === user?._id ? 'teal' : 'gray.700'
              }
              borderRadius="lg"
              maxW="75%"
              px={2}
              marginLeft={message.sender._id === user?._id ? 'auto' : ''}
            >
              <Box
                key={`${message._id}__m`}
                display="flex"
                alignItems="center"
                p={1}
              >
                <Text color="white" key={`${message._id}__mc`}>
                  {message.content}
                </Text>
                <Text
                  key={`${message._id}__md`}
                  color="whiteAlpha.700"
                  fontSize="xs"
                  alignSelf="flex-end"
                  ml={1}
                >
                  {format(new Date(message.createdAt), 'dd/MM/yy HH:mm')}
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
    </ScrollableFeed>
  );
};
