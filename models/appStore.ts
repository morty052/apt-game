import { charactersArray } from 'constants/characters';
import { CharacterProps, GameModes, inviteProps, StatsProps } from 'types';
import { create } from 'zustand';

type AppStoreProps = {
  connected: boolean;
  character: CharacterProps;
  rewardCount: number;
  mode: GameModes;
  matchmaking: boolean;
  matchFound: boolean;
  stats: StatsProps;
  invites: inviteProps[] | [] | undefined;
};

export const useAppStore = create<AppStoreProps>((set, state) => ({
  mode: 'HEAD_TO_HEAD',
  character: charactersArray[0],
  matchmaking: false,
  connected: false,
  matchFound: false,
  invites: [],
  rewardCount: 1,
  stats: {
    level: 0,
    wins: 0,
    losses: 0,
    points: 0,
    games_played: 0,
    high_score: 0,
  },
}));
