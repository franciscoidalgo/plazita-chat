/* eslint-disable react/jsx-key */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAppProvider } from '../../context/AppContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const toast = useToast();
  const { setUser } = useAppProvider();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please Fill all the Fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user/login',
        { email, password },
        config
      );

      toast({
        title: 'Login was Successful',
        status: 'success',
        isClosable: true,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      router.push('/chats');
    } catch (err) {
      const errors = err as AxiosError;
      if (errors.isAxiosError) {
        toast({
          title: 'An Error has Occurred!',
          description: errors.response?.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      } else {
        toast({
          title: 'An Error has Occurred!',
          description: `${err}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
      setLoading(false);
    }
  };

  return (
    <VStack>
      <FormControl id="emailLogin" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="passwordLogin" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter Your Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </FormControl>
      <Button
        width="100%"
        mt="15px"
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};
