import { create } from 'zustand';
import { Audio, AVPlaybackSource } from 'expo-av';

type SoundTrackNames = 'MATCH_FOUND' | 'WRONG_LETTER' | 'WINNER_SOUND' | 'LOSER_SOUND';

// const soundTracks = {
//   matchFoundSound,
//   wrongLetterSound,
// };

const SOUND_TRACK_NAMES = {
  MATCH_FOUND: 0,
  WRONG_LETTER: 1,
  WINNER_SOUND: 2,
  LOSER_SOUND: 3,
};

type AppStoreProps = {
  activeSound: Audio.Sound | null;
  soundFiles: AVPlaybackSource[];
  soundTrack: Audio.Sound[];
  loadedSoundTrack: boolean;
  //   loadSound: (title: SoundTrackNames) => Promise<void>;
  playSound: (TRACK_NAME: SoundTrackNames) => void;
  playLoadedSound: () => Promise<void>;
  loadGameSoundtrack: () => Promise<void>;
};

export const useSoundTrackModel = create<AppStoreProps>((set, state) => ({
  activeSound: null,
  soundFiles: [
    require('../assets/sounds/playButton.mp3'),
    require('../assets/sounds/wrongletter.mp3'),
    require('../assets/sounds/winner-sound.mp3'),
    require('../assets/sounds/loser-sound.mp3'),
  ],
  soundTrack: [],
  loadedSoundTrack: false,
  loadGameSoundtrack: async () => {
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
  playSound: async (TRACK_NAME: SoundTrackNames) => {
    try {
      const sound =
        state().soundTrack[SOUND_TRACK_NAMES[TRACK_NAME as keyof typeof SOUND_TRACK_NAMES]];
      await sound?.playAsync();
      console.log('Playing Sound', sound);
    } catch (error) {
      console.error(error);
    }
  },
}));
