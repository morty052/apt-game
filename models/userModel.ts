import { create } from 'zustand';
import { avatarStateProps } from './avatarStateContext';
import { WagerProps } from 'screens/market/components/WagerGrid';

export type UserProps = {
  firstname: string;
  lastname: string;
  avatar: avatarStateProps['riveAvatarSelections'];
  username: string;
  email: string;
  // id: string;
};

type NewUserProps = {
  firstname: string;
  lastname: string;
  avatar: string;
  username: string;
  email: string;
  id: string;
  activeWager: WagerProps | null;
  setFirstName: (fistname: string) => void;
  setLastName: (lastname: string) => void;
  // setAvatar: (type: string) => void;
  setUsername: (username: string) => void;
  setUserEmail: (email: string) => void;
  setActiveWager: (wager: WagerProps) => void;
};

export const useUserModel = create<NewUserProps>((set) => ({
  firstname: '',
  lastname: '',
  avatar: '',
  username: '',
  id: '',
  email: '',
  activeWager: null,
  setFirstName: (firstname: string) => set(() => ({ firstname })),
  setLastName: (lastname: string) => set(() => ({ lastname })),
  setUsername: (username: string) => set(() => ({ username })),
  // setAvatar: (avatar: string) => set(() => ({ avatar })),
  setUserEmail: (email: string) => set(() => ({ email })),
  setActiveWager: (wager: WagerProps) => set(() => ({ activeWager: wager })),
}));
