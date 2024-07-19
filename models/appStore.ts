import { charactersArray } from 'constants/characters';
import { CharacterProps, GameModes } from 'types';
import { create } from 'zustand';

type AppStoreProps = {
  online: boolean;
  matchmaking: boolean;
  mode: GameModes;
  character: CharacterProps;
  setCharacter: (character: CharacterProps) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  setGameMode: (mode: GameModes) => void;
};

export const useAppStore = create<AppStoreProps>((set) => ({
  connected: false,
  online: false,
  matchmaking: false,
  mode: 'HEAD_TO_HEAD',
  character: charactersArray[0],
  setCharacter: (character: CharacterProps) => set({ character }),
  setConnected: (connected: boolean) => set({ connected }),
  setGameMode: (mode: GameModes) => set({ mode }),
}));
