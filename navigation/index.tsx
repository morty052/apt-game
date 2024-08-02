import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GameStack from 'Routes/GameStack';
import RegistrationScreen from 'screens/registration';

export type RootTabsParamList = {
  Home: undefined;
  Market: undefined;
  UserWagersScreen: undefined;
  Creator: undefined;
  MiniGames: undefined;
};

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
        {/* <Stack.Screen name="GameStack" component={UserAvatar} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
