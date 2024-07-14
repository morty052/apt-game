import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { TestScreen } from 'screens/testscreen';
import { getItem } from 'utils/storage';

import RootStack from './navigation';

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

  // return <TestScreen />;

  return <RootStack onboarded={onboarded} />;
}
