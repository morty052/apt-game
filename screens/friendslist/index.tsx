import { createStackNavigator } from '@react-navigation/stack';

import { FriendRequestsScreen } from './components/FriendRequestsScreen';
import { FriendsHomeScreen } from './components/FriendsHomeScreen';

const Stack = createStackNavigator();

export default function FriendListScreen({ navigation }: any) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FriendsHomeScreen" component={FriendsHomeScreen} />
      <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
    </Stack.Navigator>
  );
}
