import { createStackNavigator } from '@react-navigation/stack';
import CharacterSelectWindow from 'components/CharacterSelectWindow';
import MatchConfirmationModal from 'components/MatchConfirmationModal';
import SocketContextComponent from 'contexts/SocketContextComponent';
import FriendListScreen from 'screens/friendslist';
import GameScreen from 'screens/game-screen';
import HelpScreen from 'screens/helpscreen';
import Home from 'screens/home';
import LeaderBoard from 'screens/leaderboard';
import Lobby from 'screens/lobby';
import MarketScreen from 'screens/market';
import ModeScreen from 'screens/modes-screen';
import SettingsScreen from 'screens/settings-screen';
import { friend } from 'types';

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
  Lobby: {
    mode: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH';
    friends?: friend[];
  };
};

const Stack = createStackNavigator<GameStackParamList>();

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
        <Stack.Screen name="Market" component={MarketScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="PlayerScreen" component={HelpScreen} />
        <Stack.Screen name="Profile" component={HelpScreen} />
        <Stack.Screen name="Lobby" component={Lobby} />
      </Stack.Navigator>
      <MatchConfirmationModal />
    </SocketContextComponent>
  );
}
