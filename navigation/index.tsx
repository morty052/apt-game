import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GameStack from 'Routes/GameStack';
import { Colors } from 'constants/colors';
import SocketContextComponent from 'contexts/SocketContextComponent';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Home, ModeScreen, RegistrationScreen } from 'screens';
import { GameScreen } from 'screens/game-screen';

export type RootTabsParamList = {
  Home: undefined;
  Market: undefined;
  UserWagersScreen: undefined;
  Creator: undefined;
  MiniGames: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParamList>();

export type RootStackParamList = {
  App: undefined;
  ModeSelect: undefined;
  OnboardingStack: { name: string };
  GameScreen: { channel: string };
  GameStack: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack({ onboarded }: { onboarded: boolean | null }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={!onboarded ? 'OnboardingStack' : 'GameStack'}>
        <Stack.Screen name="OnboardingStack" component={RegistrationScreen} />
        <Stack.Screen name="GameStack" component={GameStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}