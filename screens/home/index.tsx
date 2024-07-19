import { useNavigation } from '@react-navigation/native';
import BottomNav from 'components/BottomNav';
import { Character } from 'components/CharacterSelectWindow';
import LoadingScreen from 'components/LoadingScreen';
import CharacterSelectButton from 'components/action-buttons/CharacterSelectButton';
import GameModeButton from 'components/action-buttons/GameModeButton';
import HelpButton from 'components/action-buttons/HelpButton';

import SocketContext from 'contexts/SocketContext';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import React, { useContext } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

import GameBackgroundImage from '../../assets/game-background-image--min.jpg';
import TopNav from 'components/TopNav';

function RightNav() {
  return (
    <View>
      <View style={styles.actionButtonsContainer}>
        <CharacterSelectButton />
        <GameModeButton />
        <HelpButton />
      </View>
    </View>
  );
}

export const Home = () => {
  const [selectingCharacter, setSelectingCharacter] = React.useState(false);
  const [selectingMode, setSelectingMode] = React.useState(false);
  const [findingMatch, setFindingMatch] = React.useState(false);

  const { socket } = useContext(SocketContext);

  const { initGame } = useGameStore();
  const { character, mode, connected } = useAppStore();

  const navigation = useNavigation<any>();

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

  // useEffect(() => {
  //   navigation.setOptions({ tabBarStyle: { display: 'none' } });
  // }, []);

  if (!connected) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground source={GameBackgroundImage} style={styles.container}>
      <SafeAreaView style={{ flex: 1, gap: 20 }}>
        <TopNav />
        <RightNav />
        <Character url={character.url} />
        <BottomNav onPressPlay={handleFindMatch} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'skyblue',
    paddingBottom: 0,
    position: 'relative',
    gap: 20,
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
    top: 30,
    right: 10,
    width: 60,
    // backgroundColor: 'rgba(255,255,255,0.5)',
    // borderWidth: 1,
    borderColor: 'black',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
    borderRadius: 20,
  },
});
