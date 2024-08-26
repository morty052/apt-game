import { createStackNavigator } from '@react-navigation/stack';
import CharacterSelectWindow from 'components/CharacterSelectWindow';
import MatchConfirmationModal from 'components/MatchConfirmationModal';
import NetworkFailedModal from 'components/NetworkFailedModal';
import SettingsButton from 'components/action-buttons/SettingsIcon';
import { BackButton } from 'components/ui/BackButton';
import { Colors } from 'constants/colors';
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
import Profile from 'screens/profile';
import RoadMapScreen from 'screens/roadmap';
import SettingsScreen from 'screens/settings-screen';
import SinglePlayerGame from 'screens/singleplayer';
import { UserAvatarEditor } from 'screens/user-avatar-creator/UserAvatarCreator';

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
  PlayerScreen: {
    username: string;
  };
  GameScreen: { room: string };
  SinglePlayerGameScreen: undefined;
  NotificationsScreen: { room: string };
  Lobby: {
    mode: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH';
    private_room?: string;
    guests?: string[];
  };
  HomeScreen: undefined;
  RoadMapScreen: undefined;
  AvatarEditor: undefined;
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

const GameRoutes = ({ navigation }: any) => {
  return (
    <SocketContextComponent>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={Home} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'black' },
            headerLeft: () => <BackButton onPress={() => navigation.navigate('HomeScreen')} />,
            headerStyle: { backgroundColor: Colors.plain },
            headerTitle: 'Friends',
            headerShadowVisible: false,
          }}
          name="FriendsList"
          component={FriendListScreen}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Notifications',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'white' },
            headerTitleAlign: 'center',
            headerBackTitle: '',
            headerStyle: { backgroundColor: Colors.tertiary },
            headerLeft: () => <BackButton onPress={() => navigation.navigate('HomeScreen')} />,
            headerShadowVisible: false,
          }}
          name="NotificationsScreen"
          component={NotificationsScreen}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'white' },
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerStyle: { backgroundColor: Colors.tertiary },
            headerTitle: 'Game Modes',
          }}
          name="ModeSelectScreen"
          component={ModeScreen}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'white' },
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerStyle: { backgroundColor: Colors.tertiary },
          }}
          name="Lobby"
          component={Lobby}
        />
      </Stack.Navigator>
    </SocketContextComponent>
  );
};

export default function GameStack({ navigation }: any) {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GameTabs" component={GameRoutes} />
        <Stack.Screen name="SinglePlayerGameScreen" component={SinglePlayerGame} />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Character Select',
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'white' },
            headerStyle: { backgroundColor: Colors.tertiary },
            headerLeft: () => <BackButton onPress={() => navigation.navigate('GameTabs')} />,
            headerShadowVisible: false,
          }}
          name="CharacterSelect"
          component={CharacterSelectWindow}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'black' },
            headerLeft: () => <BackButton onPress={() => navigation.navigate('GameTabs')} />,
            headerStyle: { backgroundColor: Colors.plain },
            headerShadowVisible: false,
          }}
          name="LeaderBoard"
          component={LeaderBoard}
        />

        {/* <Stack.Screen name="GameScreen" component={GameRoute} /> */}
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Settings',
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'black' },
            headerStyle: { backgroundColor: Colors.plain },
            headerLeft: () => <BackButton onPress={() => navigation.navigate('GameTabs')} />,
            headerShadowVisible: false,
          }}
          name="SettingsScreen"
          component={SettingsScreen}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'Crispy-Tofu', color: 'white' },
            headerLeft: () => <BackButton onPress={() => navigation.navigate('GameTabs')} />,
            headerStyle: { backgroundColor: Colors.tertiary },
            headerShadowVisible: false,
          }}
          name="Store"
          component={MarketScreen}
        />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen
          name="Profile"
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { color: 'white', fontFamily: 'Crispy-Tofu' },
            headerStyle: { backgroundColor: Colors.tertiary },
            headerRight: () => <SettingsButton />,
            headerLeft: () => <BackButton onPress={() => navigation.navigate('GameTabs')} />,
            headerShadowVisible: false,
          }}
          component={Profile}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Quests',
            headerBackTitle: '',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: { color: 'white', fontFamily: 'Crispy-Tofu' },
            headerStyle: { backgroundColor: Colors.tertiary },
          }}
          name="RoadMapScreen"
          component={RoadMapScreen}
        />

        <Stack.Screen name="AvatarEditor" component={UserAvatarEditor} />
      </Stack.Navigator>
      <MatchConfirmationModal />
      <NetworkFailedModal />
    </>
  );
}
