import { createStackNavigator } from '@react-navigation/stack';

import { FriendRequestsScreen } from './components/FriendRequestsScreen';
import { FriendsHomeScreen } from './components/FriendsHomeScreen';
import { BackButton } from 'components/ui/BackButton';
import { Colors } from 'constants/colors';

const Stack = createStackNavigator();

export default function FriendListScreen({ navigation }: any) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FriendsHomeScreen" component={FriendsHomeScreen} />
      <Stack.Screen
        name="FriendRequests"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton onPress={() => navigation.navigate('FriendsHomeScreen')} />,
          headerTitle: 'Friend Requests',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.backGround },
          headerTitleStyle: { color: 'white', fontFamily: 'Crispy-Tofu' },
        }}
        component={FriendRequestsScreen}
      />
    </Stack.Navigator>
  );
}
