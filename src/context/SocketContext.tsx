import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface Props {
  socketApiServer: string;
}

const SocketContext = React.createContext<Socket | undefined>(undefined);

export const SocketProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  socketApiServer,
}) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(socketApiServer);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [socketApiServer]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketProvider = () => useContext(SocketContext);
