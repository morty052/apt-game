import { NavigationProp, RouteProp } from '@react-navigation/native';
import { GameStackParamList } from 'Routes/GameStack';
import CharacterSelectWindow, { Character } from 'components/CharacterSelectWindow';
import { Button } from 'components/ui/Button';
import SocketContext from 'contexts/SocketContext';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModeScreen, ModeSelectWindow } from 'screens/modes-screen';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

function CharacterSelectButton({ onPress }: { onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.actionButton} />;
}

function ModeSelectButton({ onPress }: { onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.actionButton} />;
}

export function Lobby({
  navigation,
  route,
}: {
  navigation: NavigationProp<GameStackParamList>;
  route: RouteProp<GameStackParamList, 'Lobby'>;
}) {
  const [selectingCharacter, setSelectingCharacter] = React.useState(false);
  const [selectingMode, setSelectingMode] = React.useState(false);
  const [findingMatch, setFindingMatch] = React.useState(false);
  const { mode } = route.params;
  const { socket } = React.useContext(SocketContext);
  const { initGame } = useGameStore();

  const { character } = useAppStore();

  const handleFindMatch = React.useCallback(() => {
    socket?.emit(
      'FIND_MATCH',
      {
        lobbyType: mode,
        player: {
          username: getItem('USERNAME'),
          character: character.name,
        },
      },
      (data: { matchId?: string }) => {
        setFindingMatch(true);
      }
    );
  }, [character, mode, socket]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'skyblue' }}>
      <View style={styles.container}>
        {!selectingCharacter && !selectingMode && (
          <View style={styles.actionButtonsContainer}>
            <CharacterSelectButton onPress={() => setSelectingCharacter(true)} />
            <ModeSelectButton onPress={() => setSelectingMode(true)} />
            <CharacterSelectButton onPress={() => setSelectingCharacter(true)} />
          </View>
        )}
        {selectingCharacter && (
          <CharacterSelectWindow
            selectingCharacter={selectingCharacter}
            setSelectingCharacter={setSelectingCharacter}
          />
        )}
        {selectingMode && (
          <ModeSelectWindow selectingMode={selectingMode} setSelectingMode={setSelectingMode} />
        )}
        {!selectingCharacter && !selectingMode && (
          <View style={{ gap: 40 }}>
            <Character url={character.url} />
            <Button onPress={handleFindMatch} title="Find Match" />
          </View>
        )}
        {/* {!findingMatch && <Button onPress={handleFindMatch} title="Find Match" />}
      {findingMatch && <Button onPress={() => mockhandleFindMatch('doc')} title="Finding Match" />} */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'skyblue',
    gap: 20,
    paddingBottom: 20,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  actionButton: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'black',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
    borderRadius: 20,
  },
});
