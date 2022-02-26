/* eslint-disable react/jsx-key */
import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { User } from '../../models/User';

interface Props {
  user?: User;
  children?: ReactNode;
  props?: BoxProps;
}

export const ProfileModal: React.FC<Props> = ({ user, children, props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box alignSelf="center" {...props}>
      {children ? (
        <div onClick={onOpen}>{children}</div>
      ) : (
        <IconButton
          aria-label="Show Profile"
          display={{ base: 'flex' }}
          icon={<AiOutlineEye />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader display="flex" justifyContent="center">
            {user?.name}
          </ModalHeader>
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.picture}
              alt={user?.name}
            />
            <Text fontSize={{ base: '25px', md: '27px' }}>
              Email: {user?.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
