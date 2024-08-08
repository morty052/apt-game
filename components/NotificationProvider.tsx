import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleNotification } from 'utils/handleNotification';
import { setItem } from 'utils/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
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

const Toast = () => {
  const [showing, setShowing] = useState(false);
  if (!showing) {
    return null;
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Toast</Text>
      </SafeAreaView>
    </View>
  );
};

/**
 * Creates a notifications provider component that handles push notifications and sets up listeners for received notifications and response.
 * displays a toast for invites and friend requests
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @return {JSX.Element} The notifications provider component.
 */
export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log({ notification: notification.request.content.data });
      handleNotification(notification.request.content.data?.type);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {}
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current as Notifications.Subscription
      );
      Notifications.removeNotificationSubscription(
        responseListener.current as Notifications.Subscription
      );
    };
  }, []);
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {children}
      <Toast />
    </View>
  );
};

export default NotificationsProvider;

const styles = StyleSheet.create({
  container: {
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'orange',
    flex: 1,
  },
});
