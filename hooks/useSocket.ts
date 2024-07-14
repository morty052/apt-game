import React from 'react';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';

export const useSocket = (uri: string, opts: Partial<ManagerOptions & SocketOptions>): Socket => {
  const { current: socket } = React.useRef(io(uri, opts));

  React.useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, [socket]);

  return socket;
};
