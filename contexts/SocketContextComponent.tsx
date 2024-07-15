import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { Text } from 'react-native';

import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './SocketContext';
import { useSocket } from '../hooks/useSocket';
import { getItem } from '../utils/storage';

export type ISocketContextComponentProps = PropsWithChildren;

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
  const { children } = props;

  const socket = useSocket(`https://d3d0-102-216-10-2.ngrok-free.app/user`, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,
  });

  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.connect();
    SocketDispatch({ type: 'update_socket', payload: socket });
    StartListeners();
    SendHandshake();
    // eslint-disable-next-line
  }, []);

  const StartListeners = () => {
    /** Messages */
    socket.on('user_connected', (users: string[]) => {
      console.info('User connected message received');
      SocketDispatch({ type: 'update_users', payload: users });
    });

    /** Messages */
    socket.on('user_disconnected', (uid: string) => {
      console.info('User disconnected message received');
      SocketDispatch({ type: 'remove_user', payload: uid });
    });

    /** Connection / reconnection listeners */
    socket.io.on('reconnect', (attempt) => {
      console.info('Reconnected on attempt: ' + attempt);
      SendHandshake();
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      console.info('Reconnection Attempt: ' + attempt);
    });

    socket.io.on('reconnect_error', (error) => {
      console.info('Reconnection error: ' + error);
    });

    socket.io.on('reconnect_failed', () => {
      console.info('Reconnection failure.');
    });
  };

  const SendHandshake = async () => {
    console.info('Sending handshake to server ...');

    const username = getItem('USERNAME');
    socket.emit('handshake', username, (uid: string, users: string[]) => {
      console.info('User handshake callback message received');
    });

    setLoading(false);
  };

  if (loading) return <Text>... loading Socket IO ....</Text>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch, socket }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
