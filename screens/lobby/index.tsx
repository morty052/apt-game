import { NavigationProp, RouteProp } from '@react-navigation/native';
import { GameStackParamList } from 'Routes/GameStack';
import { Text } from 'components/ui/Text';
import SocketContext from 'contexts/SocketContext';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

function Lobby({
  navigation,
  route,
}: {
  navigation: NavigationProp<GameStackParamList>;
  route: RouteProp<GameStackParamList, 'Lobby'>;
}) {
  const [selectingCharacter, setSelectingCharacter] = React.useState(false);
  const { mode, private_room } = route.params;
  const { socket } = React.useContext(SocketContext);
  const { initGame } = useGameStore();

  // const { character } = useAppStore();

  function handleStartMatch(queue: playerProps[], room: string) {
    initGame({ queue, room });
    navigation.navigate('GameScreen', { room: private_room as string });
  }

  React.useEffect(() => {
    socket?.on('PLAYER_JOINED', (data) => {
      console.log(data);
    });

    socket?.on('PLAYER_LEFT', (data) => {
      console.log(data);
    });

    socket?.on('START_PRIVATE_MATCH', (data: { queue: playerProps[]; room: string }) => {
      handleStartMatch(data.queue, data.room);
    });

    return () => {
      socket?.off('PLAYER_JOINED');
      socket?.off('PLAYER_LEFT');
      socket?.off('START_PRIVATE_MATCH');
    };
  }, [socket]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'skyblue' }}>
      <Text>{private_room}</Text>
    </SafeAreaView>
  );
}

export default Lobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'skyblue',
    gap: 20,
    paddingVertical: 20,
    position: 'relative',
  },
});
