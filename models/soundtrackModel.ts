import { create } from 'zustand';
import { Audio, AVPlaybackSource } from 'expo-av';
import { getSettings } from 'utils/storage';

type MatchSoundEffectNames =
  | 'ROUND_START'
  | 'ROUND_END'
  | 'WRONG_LETTER'
  | 'WINNER_SOUND'
  | 'LOSER_SOUND'
  | 'SCORE_FOR_ROUND_SOUND';
type OuterSoundTrackNames = 'MATCH_FOUND' | 'CLAIM_SOUND';

// const soundTracks = {
//   matchFoundSound,
//   wrongLetterSound,
// };

const SOUND_TRACK_NAMES = {
  MATCH_FOUND: 0,
  CLAIM_SOUND: 1,
};

const MATCH_SOUND_EFFECTS = {
  ROUND_START: 0,
  ROUND_END: 1,
  WRONG_LETTER: 2,
  WINNER_SOUND: 3,
  LOSER_SOUND: 4,
  SCORE_FOR_ROUND_SOUND: 5,
};

type AppStoreProps = {
  activeSound: Audio.Sound | null;
  soundFiles: AVPlaybackSource[];
  matchSoundFiles: AVPlaybackSource[];
  matchSoundEffects: Audio.Sound[];
  soundTrack: Audio.Sound[];
  loadedSoundTrack: boolean;
  loadedMatchSoundEffects: boolean;
  //   loadSound: (title: SoundTrackNames) => Promise<void>;
  playSound: (TRACK_NAME: MatchSoundEffectNames) => void;
  playOuterGameSound: (TRACK_NAME: OuterSoundTrackNames) => void;
  playLoadedSound: () => Promise<void>;
  loadGameSoundtrack: (forMatch?: boolean) => Promise<void>;
};

export const useSoundTrackModel = create<AppStoreProps>((set, state) => ({
  activeSound: null,
  soundFiles: [
    require('../assets/sounds/matchfound.mp3'),
    require('../assets/sounds/claim-sound.mp3'),
  ],
  matchSoundFiles: [
    require('../assets/sounds/start.mp3'),
    require('../assets/sounds/timeup.mp3'),
    require('../assets/sounds/wrongletter.mp3'),
    require('../assets/sounds/winner-sound.mp3'),
    require('../assets/sounds/loser-sound.mp3'),
    require('../assets/sounds/scoreForRound.mp3'),
  ],
  soundTrack: [],
  matchSoundEffects: [],
  loadedSoundTrack: false,
  loadedMatchSoundEffects: false,
  loadGameSoundtrack: async (forMatch) => {
    if (forMatch) {
      const matchSoundEffects = await Promise.all(
        state().matchSoundFiles.map(async (track) => {
          const { sound } = await Audio.Sound.createAsync(track);
          return sound;
        })
      );

      set({ matchSoundEffects, loadedMatchSoundEffects: true });
      return;
    }

    const soundTrack = await Promise.all(
      state().soundFiles.map(async (track) => {
        const { sound } = await Audio.Sound.createAsync(track);
        return sound;
      })
    );

    set({ soundTrack, loadedSoundTrack: true });
  },
  //   loadSound: async (title: SoundTrackNames) => {
  //     console.log('Loading Sound');
  //     const { sound } = await Audio.Sound.createAsync(soundTracks[title]);
  //     set({ activeSound: sound });
  //     console.log('Loaded Sound', { sound: state().activeSound });
  //   },
  playLoadedSound: async () => {
    try {
      const sound = state().activeSound;
      await sound?.playAsync();
      console.log('Playing Sound', sound);
      set({ activeSound: null });
    } catch (error) {
      console.error(error);
    }
  },
  playSound: async (SOUND_EFFECT: MatchSoundEffectNames) => {
    const { soundOn } = getSettings();
    if (!soundOn) {
      console.log('sound not enabled');
      return;
    }
    try {
      const soundToPlay =
        state().matchSoundEffects[
          MATCH_SOUND_EFFECTS[SOUND_EFFECT as keyof typeof MATCH_SOUND_EFFECTS]
        ];
      await soundToPlay.setStatusAsync({ shouldPlay: true });
      await soundToPlay.setStatusAsync({ positionMillis: 0 });
      console.log('Playing Sound');
    } catch (error) {
      console.error(error);
    }
  },
  playOuterGameSound: async (TRACK_NAME: OuterSoundTrackNames) => {
    const { soundOn } = getSettings();
    if (!soundOn) {
      console.log('sound not enabled');
      return;
    }
    try {
      const soundToPlay =
        state().soundTrack[SOUND_TRACK_NAMES[TRACK_NAME as keyof typeof SOUND_TRACK_NAMES]];
      console.log('Playing Sound');
      // await soundToPlay?.playAsync();
      await soundToPlay.setStatusAsync({ shouldPlay: true });
      await soundToPlay.setStatusAsync({ positionMillis: 0 });
      // console.log('after play', );
      // const { sound } = await Audio.Sound.createAsync(track);
    } catch (error) {
      console.error(error);
    }
  },
}));
