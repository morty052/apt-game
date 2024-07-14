import { Socket } from 'socket.io-client';

export type SocketProps = Socket;

export type answerProps = {
  Name: string;
  Animal: string;
  Place: string;
  Thing: string;
};

export type playerProps = {
  username: string;
  answers: answerProps;
  turn: number;
  score: number;
  inTallyMode: boolean;
};
