import { Socket } from 'socket.io-client';

export type SocketProps = Socket;

export type answerProps = {
  Name: string;
  Animal: string;
  Place: string;
  Thing: string;
};

export type GameModes = 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH';

export type CharacterNames = 'DETECTIVE' | 'RACOON' | 'CHAMELEON' | 'GENIUS';

export type CharacterProps = {
  name: CharacterNames;
  url: string;
  description: string;
  perk: string;
  // thumbnail: string;
};

export type playerProps = {
  username: string;
  answers: answerProps;
  turn: number;
  score: number;
  inTallyMode: boolean;
  doneTallying: boolean;
  strikes: number;
  character: CharacterNames | null;
};
