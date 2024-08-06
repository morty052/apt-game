import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite/next';
import { StatusBar } from 'expo-status-bar';
import { useDailyLogin } from 'hooks/useDailyLogin';
import { useSoundTrackModel } from 'models/soundtrackModel';
import React from 'react';
import { Platform } from 'react-native';
import GameLoadingScreen from 'screens/game-loading-screen/GameLoadingScreen';
import { TestScreen } from 'screens/testscreen';
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  // * hide splash screen
  SplashScreen.preventAutoHideAsync();
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas.projectId,
    });
    const { data } = token;

    console.log(data);
    setItem('expo_push_token', `${data}`);
  }

  return token?.data;
}

const queryClient = new QueryClient();

export default function App() {
  const [onboarded, setonboarded] = React.useState<boolean | null>(null);
  const [expoPushToken, setExpoPushToken] = React.useState<string>();
  const [notification, setNotification] = React.useState<Notifications.Notification>();
  const notificationListener = React.useRef<Notifications.Subscription | null>(null);
  const responseListener = React.useRef<Notifications.Subscription | null>(null);
  const [dbLoaded, setDbLoaded] = React.useState(false);

  const { loadedSoundTrack, loadGameSoundtrack } = useSoundTrackModel();

  const { loadedReward } = useDailyLogin();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current as Notifications.Subscription
      );
      Notifications.removeNotificationSubscription(
        responseListener.current as Notifications.Subscription
      );
    };
  }, []);

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

  // return (
  //   <SafeAreaView style={{ flex: 1, backgroundColor: '#00c4ee' }}>
  //     <Button />
  //   </SafeAreaView>
  // );

  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense>
        <SQLiteProvider databaseName="preloadedData.db" useSuspense>
          <RootStack onboarded={onboarded} />
          {/* <TestScreen /> */}
        </SQLiteProvider>
      </React.Suspense>
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
