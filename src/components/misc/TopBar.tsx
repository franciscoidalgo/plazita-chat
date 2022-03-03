/* eslint-disable react/jsx-key */
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaArrowDown, FaBell, FaSearch } from 'react-icons/fa';
import { useAppProvider } from '../../context/AppContext';
import { User } from '../../models/User';
import { ChatLoading } from '../chat/ChatLoading';
import { UserListItem } from '../UserAvatar/UserListItem';
import { ProfileModal } from './ProfileModal';
import { GiTreehouse } from 'react-icons/gi';
import { getSender } from '../../models/Chat';
import { VscColorMode } from 'react-icons/vsc';

export const TopBar: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('teal.400', 'teal.600');

  const toast = useToast();

  const router = useRouter();
  const {
    user,
    chats,
    setChats,
    setSelectedChat,
    notifications,
    setNotifications,
  } = useAppProvider();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    toast({
      title: 'Logged Out',
      status: 'info',
      isClosable: true,
    });
    router.push('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in Search',
        status: 'warning',
        position: 'top-left',
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: 'An Error has Occured',
        description: 'Failed to load the Search Results',
        status: 'error',
        position: 'top-left',
        isClosable: true,
      });
    }
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats?.find((c) => c._id === data._id)) {
        setChats([data, ...(chats ?? [])]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      const error = err as AxiosError;
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={bg}
        w="100%"
        py="5px"
        px="10px"
      >
        <Button variant="ghost" onClick={onOpen}>
          <Icon as={FaSearch} />
          <Text display={{ base: 'none', md: 'flex' }} px={4}>
            Search User
          </Text>
        </Button>
        <Text fontSize="2xl">
          <Icon as={GiTreehouse} /> Plazita Chat
        </Text>
        <Box>
          <Menu>
            <MenuButton p={1} verticalAlign="middle">
              <Icon as={FaBell} fontSize="xl" m={1} />
            </MenuButton>
            <MenuList p={2}>
              {!notifications.length && <Text textAlign="center">Empty</Text>}
              {notifications.map((notification) => (
                <MenuItem key={notification._id}>
                  {notification.chat.isGroupChat
                    ? `New message in ${notification.chat.chatName}`
                    : `New message from ${
                        user
                          ? getSender(user, notification.chat.users).name
                          : '404'
                      }`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<Icon as={FaArrowDown} />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={toggleColorMode}>Toggle color mode</MenuItem>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
          <DrawerBody className="noScrollbar">
            <Box display="flex" mb={4}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading h="6vh" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
