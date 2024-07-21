import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CharacterSelectWindow from 'components/CharacterSelectWindow';
import LoadingScreen from 'components/LoadingScreen';
import MatchConfirmationModal from 'components/MatchConfirmationModal';
import { BackButton } from 'components/ui/BackButton';
import { Colors } from 'constants/colors';
import SocketContextComponent from 'contexts/SocketContextComponent';
import { useAppStore } from 'models/appStore';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, ModeScreen, Lobby } from 'screens';
import { GameScreen } from 'screens/game-screen';

export type GameStackParamList = {
  GameTabs: undefined;
  ModeSelectScreen: undefined;
  CharacterSelect: undefined;
  SettingsScreen: undefined;
  LeaderBoard: undefined;
  FriendsList: undefined;
  GameScreen: { room: string };
  Lobby: { mode: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH' };
};

export type GameTabsParamList = {
  Home: undefined;
  Market: undefined;
  UserWagersScreen: undefined;
  Creator: undefined;
  MiniGames: undefined;
};

const Stack = createStackNavigator<GameStackParamList>();

const Tab = createBottomTabNavigator<GameTabsParamList>();

function Avatar() {
  return (
    <View
      style={{
        height: 50,
        width: 50,
        borderRadius: 70,
        backgroundColor: Colors.dark,
        borderWidth: 1,
        borderColor: 'white',
        marginLeft: 5,
      }}
    />
  );
}

function HeaderRightButtonGroup() {
  return (
    <View style={{ flexDirection: 'row', marginRight: 10, gap: 5 }}>
      <Ionicons name="search-outline" size={24} color="black" />
      <Ionicons name="chatbubble-outline" size={24} color="black" />
      <Ionicons name="person-outline" size={24} color="black" />
    </View>
  );
}

function TabBarIcon({
  title,
  children,
  focused,
}: {
  title: string;
  children: React.ReactNode;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {children}
      <Text style={{ marginTop: 4, color: focused ? Colors.primary : 'white', fontWeight: '600' }}>
        {title}
      </Text>
    </View>
  );
}

function GameTabs({ navigation }: any) {
  const { connected } = useAppStore();

  console.log({ connected });

  if (!connected) {
    return <LoadingScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 72,
          backgroundColor: Colors.dark,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} title="Home">
              <Ionicons name="home-outline" size={24} color={focused ? Colors.primary : 'white'} />
            </TabBarIcon>
          ),
          headerLeft: () => <Avatar />,
          headerRight: () => <HeaderRightButtonGroup />,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'skyblue',
          },
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} title="Market">
              <Ionicons
                name="search-outline"
                size={24}
                color={focused ? Colors.primary : 'white'}
              />
            </TabBarIcon>
          ),
          headerStyle: {
            backgroundColor: Colors.dark,
          },
          headerTitleStyle: {
            color: 'white',
          },
        }}
        name="Market"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('ModeSelectScreen');
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
                width: 80,
                borderRadius: 40,
                backgroundColor: 'skyblue',
                marginBottom: 75,
                // elevation: 5,
              }}>
              {/* <Ionicons
                  onPress={() => {
                    navigation.navigate('CreateWager');
                  }}
                  name="add-circle-outline"
                  size={70}
                  color="white"
                /> */}
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 70,
                  width: 70,
                  borderRadius: 40,
                  backgroundColor: 'white',
                  // borderWidth: 2,
                  elevation: 10,
                }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 22 }}>Play</Text>
              </View>
            </Pressable>
          ),
          headerShown: false,
        }}
        name="Creator"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} title="Ranking">
              <Ionicons name="cash-outline" size={24} color={focused ? Colors.primary : 'white'} />
            </TabBarIcon>
          ),
          headerShown: false,
        }}
        name="UserWagersScreen"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} title="Friends">
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? Colors.primary : 'white'}
              />
            </TabBarIcon>
          ),
          headerShown: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.dark,
          },
        }}
        name="MiniGames"
        component={Home}
      />
    </Tab.Navigator>
  );
}

export default function GameStack({ navigation }: any) {
  return (
    <SocketContextComponent>
      {/* <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="GameTabs" component={GameTabs} />
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Select Mode',
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: 'skyblue' },
            headerTitleStyle: { color: 'white' },
          }}
          name="ModeSelectScreen"
          component={ModeScreen}
        />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen
          options={{
            headerShown: false,
            headerTitle: '',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerStyle: { backgroundColor: 'skyblue' },
            headerShadowVisible: false,
          }}
          name="Lobby"
          component={Lobby}
        />
      </Stack.Navigator> */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GameTabs" component={Home} />
        <Stack.Screen name="CharacterSelect" component={CharacterSelectWindow} />
        <Stack.Screen name="LeaderBoard" component={CharacterSelectWindow} />
        <Stack.Screen name="FriendsList" component={CharacterSelectWindow} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="SettingsScreen" component={GameScreen} />
      </Stack.Navigator>
      <MatchConfirmationModal />
    </SocketContextComponent>
  );
}
