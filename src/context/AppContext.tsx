import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../models/User';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';

interface Context {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  selectedChat?: Chat;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
  chats?: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[] | undefined>>;
  notifications: Message[];
  setNotifications: React.Dispatch<React.SetStateAction<Message[]>>;
}

const AppContext = createContext<Context>({
  setUser: () => {},
  setSelectedChat: () => {},
  setChats: () => {},
  notifications: [],
  setNotifications: () => {},
});

export const AppProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [selectedChat, setSelectedChat] = useState<Chat>();
  const [chats, setChats] = useState<Chat[]>();
  const [notifications, setNotifications] = useState<Message[]>([]);
  // const router = useRouter();

  // useEffect(() => {
  //   const userInfoJSON = localStorage.getItem('userInfo');
  //   if (userInfoJSON) {
  //     const userInfo: User = JSON.parse(userInfoJSON);
  //     setUser(userInfo);
  //   } else {
  //     router.push('/');
  //   }
  // }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppProvider = () => {
  return useContext(AppContext);
};
