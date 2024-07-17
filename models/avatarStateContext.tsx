import { RiveRef } from 'rive-react-native';
import { create } from 'zustand';

export type avatarStateProps = {
  activeIcon:
    | 'BodyColor'
    | 'BodySize'
    | 'BodyEyes'
    | 'BodyHair'
    | 'BodyFaceHair'
    | 'BackgroundColor';
  riveAvatarSelections: {
    BodyColor: 0;
    BodySize: 0;
    BodyEyes: 0;
    BodyHair: 0;
    BodyFaceHair: 0;
    BackgroundColor: 0;
  };
  setActiveIcon: (icon: avatarStateProps['activeIcon']) => void;
  setRiveAvatarSelection: (feature: string, value: number) => void;
  setAvatar: (riveAvatarSelections: avatarStateProps['riveAvatarSelections']) => void;
};

export const useAvatarStateContext = create<avatarStateProps>((set, state) => ({
  activeIcon: 'BodyColor',
  riveAvatarSelections: {
    BodyColor: 0,
    BodySize: 0,
    BodyEyes: 0,
    BodyHair: 0,
    BodyFaceHair: 0,
    BackgroundColor: 0,
  },
  setActiveIcon: (activeIcon) => {
    const splicedIconName = activeIcon.replace('Icon', '');
    set({ activeIcon: splicedIconName as avatarStateProps['activeIcon'] });
  },
  setRiveAvatarSelection: (feature: string, value) => {
    set({
      riveAvatarSelections: {
        ...state().riveAvatarSelections,
        [feature]: value,
      },
    });
  },
  setAvatar: (riveAvatarSelections) => {
    set({ riveAvatarSelections });
  },
}));
