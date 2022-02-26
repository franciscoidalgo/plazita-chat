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
import React, { useRef, useState } from 'react';
import { useAppProvider } from '../../context/AppContext';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const pictureInput = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const router = useRouter();

  const { setUser } = useAppProvider();

  const handlePic = async (pic: File) => {
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData();
      data.append('file', pic);
      data.append('upload_preset', 'plazita-chat');
      data.append('cloud_name', 'dbxtbeuds');
      return fetch('https://api.cloudinary.com/v1_1/dbxtbeuds/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => data.url.toString())
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
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

    if (password !== confirmpassword) {
      toast({
        title: "Passwords don't match",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      let picture;
      if (
        pictureInput.current?.files &&
        pictureInput.current.files[0] !== undefined
      ) {
        picture = await handlePic(pictureInput.current.files[0]);
        if (!picture) {
          setLoading(false);
          return;
        }
      }

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user/signup',
        {
          name,
          email,
          password,
          picture,
        },
        config
      );

      toast({
        title: 'Registration was Succesful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
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
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter Your Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm Your Password"
          onChange={(e) => {
            setConfirmpassword(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="picture">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          ref={pictureInput}
          type="file"
          accept="image/*"
          p="1.5"
          border="none"
        />
      </FormControl>
      <Button
        width="100%"
        mt="15px"
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
