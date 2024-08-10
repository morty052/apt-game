import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsProvider from 'components/NotificationProvider';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite/next';
import { StatusBar } from 'expo-status-bar';
import { useDailyLogin } from 'hooks/useDailyLogin';
import { useSoundTrackModel } from 'models/soundtrackModel';
import React from 'react';
import GameLoadingScreen from 'screens/game-loading-screen/GameLoadingScreen';
import { getItem, setItem } from 'utils/storage';

import RootStack from './navigation';

const loadDataBase = async () => {
  const dbName = 'preloadedData.db';
  const dbAsset = require('./assets/preloadedData.db');
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  // if (fileInfo.exists) {
  //   await FileSystem.deleteAsync(`${FileSystem.documentDirectory}SQLite`);
  // }
  // console.log('deleted', fileInfo.exists);

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
      intermediates: true,
    });
  }
  console.log('file created');
  await FileSystem.downloadAsync(dbUri, dbFilePath);
  setItem('DB_PATH', dbFilePath);
};

const queryClient = new QueryClient();

export default function App() {
  const [onboarded, setonboarded] = React.useState<boolean | null>(null);
  const [dbLoaded, setDbLoaded] = React.useState(false);

  const { loadedSoundTrack, loadGameSoundtrack } = useSoundTrackModel();

  const { loadedReward } = useDailyLogin();

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
    loadGameSoundtrack();
    const DB_LOADED = getItem('DB_PATH') || null;

    if (DB_LOADED) {
      setDbLoaded(true);
      return;
    }
    loadDataBase().then(() => setDbLoaded(true));
  }, []);

  if (onboarded == null) {
    return null;
  }

  if (!loadedSoundTrack || !dbLoaded || !loadedReward) {
    return <GameLoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense>
        <SQLiteProvider databaseName="preloadedData.db" useSuspense>
          <NotificationsProvider>
            {/* <TestScreen /> */}
            <RootStack onboarded={false} />
          </NotificationsProvider>
        </SQLiteProvider>
      </React.Suspense>
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
