/* eslint-disable react/jsx-key */
import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useState } from 'react';
import { ChatBox } from '../../components/ChatBox';
import { TopBar } from '../../components/misc/TopBar';
import { MyChats } from '../../components/MyChats';
import { useAppProvider } from '../../context/AppContext';

const Chatpage: NextPage = () => {
  const { user } = useAppProvider();
  const [fetchAgain, setFetchAgain] = useState(false);

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
