import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { getItem } from 'utils/storage';
// import { Audio, AVPlaybackSource } from 'expo-av';

import RootStack from './navigation';
import PlayerLevel from 'components/PlayerLevel';
import { SafeAreaView } from 'react-native-safe-area-context';

// const LoadAudio = async (source: AVPlaybackSource) => {
//   const { sound } = await Audio.Sound.createAsync(source, {
//     shouldPlay: false,
//   });

//   return sound;
// };

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [onboarded, setonboarded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    async function getOnboarded() {
      const onboarded = getItem('ONBOARDED');
      if (!onboarded) {
        setonboarded(false);
        await SplashScreen.hideAsync();
        return;
      }

      setonboarded(true);
      await SplashScreen.hideAsync();
    }

    getOnboarded();
  }, []);

  if (onboarded == null) {
    return null;
  }

  // return (
  //   <SafeAreaView style={{ flex: 1 }}>
  //     <PlayerLevel />
  //   </SafeAreaView>
  // );

  return <RootStack onboarded={onboarded} />;
}
