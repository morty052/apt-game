import { create } from 'zustand';

type AppStoreProps = {
  online: boolean;
  matchmaking: boolean;
};

export const useAppStore = create<AppStoreProps>((set) => ({
  online: false,
  matchmaking: false,
}));
