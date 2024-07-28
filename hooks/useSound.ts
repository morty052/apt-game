import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Audio, AVPlaybackSource } from 'expo-av';
import matchFoundSound from '../assets/sounds/playButton.mp3';
import wrongLetterSound from '../assets/sounds/wrongletter.mp3';

type SoundTrackName = 'matchFoundSound' | 'wrongLetterSound';

export default function useSound() {
  const [sound, setSound] = useState<null | Audio.Sound>(null);

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/wrongletter.mp3'));
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return {
    playSound,
    sound,
  };
}

export function useGameSoundTrack() {
  const [sound, setSound] = useState<null | Audio.Sound>(null);
  const [soundTracks] = useState<Record<string, AVPlaybackSource>>({
    matchFoundSound,
    wrongLetterSound,
  });

  async function loadSound(source: AVPlaybackSource, title: string) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(soundTracks[title as string], {
      shouldPlay: false,
    });
    setSound(sound);
    console.log('Playing Sound');
    await sound.playAsync();
  }

  async function playSound(title: SoundTrackName) {
    try {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(soundTracks[title as string]);
      setSound(sound);
      console.log('Playing Sound');
      await sound.playAsync();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return {
    loadSound,
    playSound,
  };
}
