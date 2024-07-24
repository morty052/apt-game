import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { getItem } from 'utils/storage';
import RootStack from './navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FriendListScreen from 'screens/friendslist';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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

  return (
    <QueryClientProvider client={queryClient}>
      <RootStack onboarded={onboarded} />
    </QueryClientProvider>
  );
}
