import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { setItem } from 'utils/storage';

import Toast, { notificationDataTypes } from './Toast';

const handleNotification = ({
  type,
  showToast,
  data,
}: {
  type: notificationDataTypes;
  showToast: (data: { type: notificationDataTypes; data?: any }) => void;
  data?: any;
}) => {
  if (type === 'INVITE') {
    showToast({ type, data });
    return;
  }
  showToast({ type });
};

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
  const [showToast, setShowToast] = useState<{ type: notificationDataTypes; data?: any } | null>(
    null
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      handleNotification({
        type: notification.request.content.data?.type,
        showToast: setShowToast,
        data: notification.request.content.data,
      });
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
      <Toast setShowing={setShowToast} showing={showToast} />
    </View>
  );
};

export default NotificationsProvider;
