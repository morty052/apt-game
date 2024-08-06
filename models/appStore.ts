import { charactersArray } from 'constants/characters';
import { CharacterProps, GameModes, inviteProps } from 'types';
import { create } from 'zustand';

type stats = {
  loginStreak: 0;
  wins: 0;
  losses: 0;
  totalPoints: 0;
  totalGames: 0;
};

type AppStoreProps = {
  connected: boolean;
  character: CharacterProps;
  rewardCount: number;
  mode: GameModes;
  matchmaking: boolean;
  matchFound: boolean;
  highScore: number;
  invites: inviteProps[] | [] | undefined;
  setCharacter: (character: CharacterProps) => void;
  setGameMode: (mode: GameModes) => void;
  setMatchmaking: (matchmaking: boolean) => void;
  setMatchFound: (matchFound: boolean) => void;
};

export const useAppStore = create<AppStoreProps>((set, state) => ({
  mode: 'HEAD_TO_HEAD',
  character: charactersArray[0],
  matchmaking: false,
  connected: false,
  matchFound: false,
  highScore: 0,
  invites: [],
  rewardCount: 1,
  setCharacter: (character: CharacterProps) => set({ character }),
  setGameMode: (mode: GameModes) => set({ mode }),
  setMatchmaking: (matchmaking: boolean) => set({ matchmaking }),
  setMatchFound: (matchFound: boolean) => set({ matchFound }),
}));
