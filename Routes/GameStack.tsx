import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import CharacterSelectWindow from 'components/CharacterSelectWindow';
import LoadingScreen from 'components/LoadingScreen';
import MatchConfirmationModal from 'components/MatchConfirmationModal';
import TopNav from 'components/TopNav';
import TabBar from 'components/tabbar/TabBar';
import SocketContextComponent from 'contexts/SocketContextComponent';
import { useAppStore } from 'models/appStore';
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
import { friend } from 'types';
import { getItem } from 'utils/storage';
import { getPlayerDetails } from 'utils/supabase';

export type GameStackParamList = {
  GameTabs: undefined;
  ModeSelectScreen: undefined;
  CharacterSelect: undefined;
  SettingsScreen: undefined;
  LeaderBoard: undefined;
  FriendsList: undefined;
  Market: undefined;
  HelpScreen: undefined;
  Profile: undefined;
  PlayerScreen: undefined;
  GameScreen: { room: string };
  NotificationsScreen: { room: string };
  Lobby: {
    mode: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH';
    friends?: friend[];
  };
};

const Stack = createStackNavigator<GameStackParamList>();

const Tabs = createBottomTabNavigator();

const GameTabs = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'red',
          height: 70,
        },
      }}>
      <Tabs.Screen name="Friends" component={FriendListScreen} />
      <Tabs.Screen name="Market" component={MarketScreen} />
      <Tabs.Screen
        // options={{ header: () => <TopNav />, headerShown: true }}
        name="Home"
        component={Home}
      />
      <Tabs.Screen name="Standings" component={LeaderBoard} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
};

export default function GameStack({ navigation }: any) {
  const { isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const username = getItem('USERNAME');
      const data = await getPlayerDetails(username as string);
      useAppStore.setState((state) => ({
        ...state,
        invites: data[0]?.game_invites || [],
      }));
      console.log(data[0].game_invites);
      return data;
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SocketContextComponent>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GameTabs" component={GameTabs} />
        <Stack.Screen name="CharacterSelect" component={CharacterSelectWindow} />
        <Stack.Screen name="LeaderBoard" component={LeaderBoard} />
        <Stack.Screen name="FriendsList" component={FriendListScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="ModeSelectScreen" component={ModeScreen} />
        <Stack.Screen name="Market" component={MarketScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="PlayerScreen" component={HelpScreen} />
        <Stack.Screen name="Profile" component={HelpScreen} />
        <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      </Stack.Navigator>
      <MatchConfirmationModal />
    </SocketContextComponent>
  );
}
