import { useQuery } from '@tanstack/react-query';
import LoadingScreen from 'components/LoadingScreen';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import SocketContext from 'contexts/SocketContext';
import { useGameSoundTrack } from 'hooks/useSound';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import React, { useContext } from 'react';
import { StyleSheet, View, Pressable, FlatList, Dimensions } from 'react-native';
import PendingMatchScreen from 'screens/pending-match-screen/PendingMatchScreen';
import { GameModes, playerProps } from 'types';
import { getItem } from 'utils/storage';
import { getInvites } from 'utils/supabase';

const modes: { value: GameModes; name: string }[] = [
  {
    value: 'HEAD_TO_HEAD',
    name: 'Head To Head',
  },
  {
    value: 'TRIPLE_THREAT',
    name: 'Triple threat',
  },
  {
    value: 'FULL_HOUSE',
    name: 'Full House',
  },
  {
    value: 'PRIVATE_MATCH',
    name: 'Private Match',
  },
];

function ModeCard({
  mode,
  handlePress,
}: {
  mode: { value: GameModes; name: string };
  handlePress: (GameMode: GameModes) => void;
}) {
  return (
    <Pressable onPress={() => handlePress(mode.value)} style={styles.modeCard}>
      <Text style={{ color: 'white' }}>{mode.name}</Text>
    </Pressable>
  );
}

function SeasonCard() {
  return <Pressable style={styles.seasonCard}></Pressable>;
}

function ModesGrid({ handlePress }: { handlePress: (GameMode: GameModes) => void }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ marginLeft: 5 }}>Game Modes</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        horizontal
        data={modes}
        renderItem={({ item }) => <ModeCard handlePress={handlePress} mode={item} />}
      />
    </View>
  );
}

function WeeklyGoals() {
  function handlePress(mode: GameModes) {
    console.log(mode);
  }
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ marginLeft: 5 }}>Weekly Goals</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        horizontal
        data={modes}
        renderItem={({ item }) => <ModeCard handlePress={handlePress} mode={item} />}
      />
    </View>
  );
}

export const Home = () => {
  const { socket } = useContext(SocketContext);

  const { initGame } = useGameStore();
  const { character, connected, matchmaking } = useAppStore();

  const { playSound } = useGameSoundTrack();

  const { isLoading } = useQuery({
    queryKey: ['matchInvites'],
    queryFn: async () => {
      const username = getItem('USERNAME');
      const data = await getInvites(username as string);
      useAppStore.setState(() => ({ invites: data }));
      return data;
    },
  });

  const handleFindMatch = React.useCallback(
    (mode: GameModes) => {
      if (matchmaking) {
        return;
      }
      const username = getItem('USERNAME') as string;
      useAppStore.setState(() => ({ matchmaking: true }));
      socket?.emit(
        'FIND_MATCH',
        {
          lobbyType: mode,
          player: {
            username,
            character: character.name,
          },
        },
        (data: { matchId?: string }) => {
          console.log('joined queue');
        }
      );
      console.log(mode);
    },
    [character, socket, matchmaking, useAppStore, getItem]
  );

  function handleMatchFound(queue: playerProps[], room: string) {
    //* save current player room and opponents to state
    initGame({ queue, room });

    //* open match found modal clear matchmaking state
    useAppStore.setState(() => ({ matchmaking: false, matchFound: true }));
    // navigation.navigate('GameScreen', { room });
  }

  React.useEffect(() => {
    socket?.on('MATCH_FOUND', (data: { queue: playerProps[]; room: string }) => {
      handleMatchFound(data.queue, data.room);
    });
  }, [socket]);

  if (!connected || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <View style={styles.container}>
        <SeasonCard />
        <ModesGrid handlePress={(mode) => handleFindMatch(mode)} />
        <WeeklyGoals />
      </View>
      <PendingMatchScreen />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.plain,
    paddingBottom: 0,
    paddingHorizontal: 5,
    position: 'relative',
    gap: 30,
    paddingTop: 30,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 0,
    // backgroundColor: 'red',
  },
  actionButton: {
    height: 50,
    width: 50,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 100,
    right: 10,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.5)',
    // borderWidth: 1,
    borderColor: 'black',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
    borderRadius: 20,
  },
  modeCard: {
    width: Dimensions.get('window').width * 0.9,
    minWidth: 300,
    backgroundColor: 'orange',
    height: 150,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  seasonCard: {
    width: Dimensions.get('window').width * 0.95,
    minWidth: 300,
    backgroundColor: Colors.backGround,
    height: 150,
    borderRadius: 20,
    alignSelf: 'center',
  },
});
