/* eslint-disable react/jsx-key */
import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../models/User';

interface Props {
  user: User;
  handleFunction: React.MouseEventHandler;
}

export const UserListItem: React.FC<Props> = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="teal"
      _hover={{
        bg: 'white',
        color: 'teal.500',
      }}
      w="100%"
      h="6vh"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.picture}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};
