import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { Platform } from 'react-native';
import { getItem, setItem } from 'utils/storage';

import RootStack from './navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'components/ui/Button';

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
  }, []);

  if (onboarded == null) {
    return null;
  }

  // return (
  //   <SafeAreaView style={{ flex: 1, backgroundColor: '#00c4ee' }}>
  //     <Button />
  //   </SafeAreaView>
  // );

  return (
    <QueryClientProvider client={queryClient}>
      <RootStack onboarded={onboarded} />
    </QueryClientProvider>
  );
}
