import { NavigationProp, RouteProp } from '@react-navigation/native';
import { GameStackParamList } from 'Routes/GameStack';
import { Button } from 'components/ui/Button';
import SocketContext from 'contexts/SocketContext';
import { useGameStore } from 'models/gameStore';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

export function Lobby({
  navigation,
  route,
}: {
  navigation: NavigationProp<GameStackParamList>;
  route: RouteProp<GameStackParamList, 'Lobby'>;
}) {
  const [findingMatch, setFindingMatch] = React.useState(false);
  const { mode } = route.params;
  const { socket } = React.useContext(SocketContext);
  const { initGame } = useGameStore();

  function handleFindMatch() {
    socket?.emit(
      'FIND_MATCH',
      {
        lobbyType: mode,
        player: {
          username: getItem('USERNAME'),
        },
      },
      (data: { matchId?: string }) => {
        setFindingMatch(true);
      }
    );
  }

  function mockhandleFindMatch(username: string) {
    socket?.emit(
      'FIND_MATCH',
      {
        lobbyType: mode,
        player: {
          username,
        },
      },
      (data: { matchId?: string }) => {
        setFindingMatch(true);
      }
    );
  }

  function handleMatchFound(queue: playerProps[], room: string) {
    // * get current player from queue
    const player = queue.filter((player) => player.username === getItem('USERNAME'))[0];

    // * get opponents from queue
    const opponents = queue.filter((player) => player.username !== getItem('USERNAME'));

    //* save current player and opponents to state
    initGame(player, opponents);

    navigation.navigate('GameScreen', { room });
  }

  React.useEffect(() => {
    socket?.on('MATCH_FOUND', (data: { queue: playerProps[]; room: string }) => {
      handleMatchFound(data.queue, data.room);
    });
  }, [socket]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>{mode}</Text>
      {!findingMatch && <Button onPress={handleFindMatch} title="Find Match" />}
      {findingMatch && <Button onPress={() => mockhandleFindMatch('doc')} title="Finding Match" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'skyblue',
    gap: 20,
    paddingTop: 20,
  },
});
