import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CharacterSelectWindow from 'components/CharacterSelectWindow';
import MatchConfirmationModal from 'components/MatchConfirmationModal';
import TopNav from 'components/TopNav';
import TabBar from 'components/tabbar/TabBar';
import { BackButton } from 'components/ui/BackButton';
import SocketContextComponent from 'contexts/SocketContextComponent';
import FriendListScreen from 'screens/friendslist';
import GameScreen from 'screens/game-screen';
import HelpScreen from 'screens/helpscreen';
import Home from 'screens/home';
import LeaderBoard from 'screens/leaderboard';
import Lobby from 'screens/lobby';
import MarketScreen from 'screens/market';
import ModeScreen from 'screens/modes-screen';
import NotificationsScreen from 'screens/notifications-screen';
import SettingsScreen from 'screens/settings-screen';

export type GameStackParamList = {
  GameTabs: undefined;
  ModeSelectScreen: undefined;
  CharacterSelect: undefined;
  SettingsScreen: undefined;
  LeaderBoard: undefined;
  FriendsList: undefined;
  Store: undefined;
  HelpScreen: undefined;
  Profile: undefined;
  PlayerScreen: undefined;
  GameScreen: { room: string };
  NotificationsScreen: { room: string };
  Lobby: {
    mode: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH';
    private_room?: string;
  };
};

const Stack = createStackNavigator<GameStackParamList>();

// const Tabs = createBottomTabNavigator();

// const GameTabs = () => {
//   return (
//     <Tabs.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: 'red',
//           height: 70,
//         },
//       }}>
//       <Tabs.Screen name="Friends" component={FriendListScreen} />
//       <Tabs.Screen name="Store" component={MarketScreen} />
//       <Tabs.Screen options={{ headerShown: false }} name="Home" component={Home} />
//       <Tabs.Screen
//         options={{
//           headerShown: true,
//           headerShadowVisible: false,
//           headerStyle: { backgroundColor: 'transparent' },
//         }}
//         name="Hero"
//         component={CharacterSelectWindow}
//       />
//       <Tabs.Screen name="Standings" component={LeaderBoard} />
//     </Tabs.Navigator>
//   );
// };

export default function GameStack({ navigation }: any) {
  return (
    <SocketContextComponent>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GameTabs" component={Home} />
        <Stack.Screen name="CharacterSelect" component={CharacterSelectWindow} />
        <Stack.Screen name="LeaderBoard" component={LeaderBoard} />
        <Stack.Screen name="FriendsList" component={FriendListScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="ModeSelectScreen" component={ModeScreen} />
        <Stack.Screen name="Store" component={MarketScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="PlayerScreen" component={HelpScreen} />
        <Stack.Screen name="Profile" component={HelpScreen} />
        <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: '',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerShadowVisible: false,
          }}
          name="NotificationsScreen"
          component={NotificationsScreen}
        />
      </Stack.Navigator>
      <MatchConfirmationModal />
    </SocketContextComponent>
  );
}
