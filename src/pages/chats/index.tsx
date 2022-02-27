/* eslint-disable react/jsx-key */
import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ChatBox } from '../../components/chat/ChatBox';
import { TopBar } from '../../components/misc/TopBar';
import { MyChats } from '../../components/chat/MyChats';
import { useAppProvider } from '../../context/AppContext';
import { User } from '../../models/User';
import { useRouter } from 'next/router';

const Chatpage: NextPage = () => {
  const { user, setUser } = useAppProvider();
  const [fetchAgain, setFetchAgain] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userInfoJSON = localStorage.getItem('userInfo');
    if (userInfoJSON) {
      const userInfo: User = JSON.parse(userInfoJSON);
      setUser(userInfo);
    } else {
      router.push('/');
    }
  }, [router, setUser]);

  return (
    <div style={{ width: '100%' }}>
      {user && <TopBar />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="92vh"
        p="10px"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
