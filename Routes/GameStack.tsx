import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CharacterSelectWindow from 'components/CharacterSelectWindow';
import LoadingScreen from 'components/LoadingScreen';
import MatchConfirmationModal from 'components/MatchConfirmationModal';
import { Colors } from 'constants/colors';
import SocketContextComponent from 'contexts/SocketContextComponent';
import { useAppStore } from 'models/appStore';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import FriendListScreen from 'screens/friendslist';
import GameScreen from 'screens/game-screen';
import Home from 'screens/home';
import LeaderBoard from 'screens/leaderboard';
import MarketScreen from 'screens/market';
import ModeScreen from 'screens/modes-screen';
import SettingsScreen from 'screens/settings-screen';

export type GameStackParamList = {
  GameTabs: undefined;
  ModeSelectScreen: undefined;
  CharacterSelect: undefined;
  SettingsScreen: undefined;
  LeaderBoard: undefined;
  FriendsList: undefined;
  Market: undefined;
  GameScreen: { room: string };
  Lobby: { mode: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH' };
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
      </Stack.Navigator>
      <MatchConfirmationModal />
    </SocketContextComponent>
  );
}
