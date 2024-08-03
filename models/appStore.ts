import { charactersArray } from 'constants/characters';
import { CharacterProps, GameModes, inviteProps } from 'types';
import { create } from 'zustand';

type AppStoreProps = {
  online: boolean;
  matchmaking: boolean;
  mode: GameModes;
  character: CharacterProps;
  connected: boolean;
  matchFound: boolean;
  highScore: number;
  invites: inviteProps[] | [] | undefined;
  setConnected: (connected: boolean) => void;
  setCharacter: (character: CharacterProps) => void;
  setGameMode: (mode: GameModes) => void;
  setMatchmaking: (matchmaking: boolean) => void;
  setMatchFound: (matchFound: boolean) => void;
};

export const useAppStore = create<AppStoreProps>((set, state) => ({
  online: false,
  mode: 'HEAD_TO_HEAD',
  character: charactersArray[0],
  matchmaking: false,
  connected: false,
  matchFound: false,
  highScore: 0,
  invites: [],
  setCharacter: (character: CharacterProps) => set({ character }),
  setConnected: (connected: boolean) => set({ connected }),
  setGameMode: (mode: GameModes) => set({ mode }),
  setMatchmaking: (matchmaking: boolean) => set({ matchmaking }),
  setMatchFound: (matchFound: boolean) => set({ matchFound }),
}));
