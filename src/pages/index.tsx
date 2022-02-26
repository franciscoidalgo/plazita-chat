/* eslint-disable react/jsx-key */
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Login } from '../components/authentication/Login';
import { Signup } from '../components/authentication/Signup';

const LoginPage: NextPage = () => {
  useEffect(() => {
    const userInfoJSON = localStorage.getItem('userInfo');
    if (userInfoJSON) router.push('/chats');
  }, []);

  const router = useRouter();

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p="3px"
        bg="teal"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Heading>Plazita-Chat</Heading>
      </Box>
      <Box bg="teal" w="100%" p="4px" borderRadius="lg" borderWidth="1px">
        <Tabs isFitted>
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default LoginPage;
