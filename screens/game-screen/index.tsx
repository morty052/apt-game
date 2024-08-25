import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExitConfirmationModal from 'components/ExitConfirmationModal';
import AlphabetSelectScreen from 'components/game-elements/AlphabetSelectScreen';
import GameOverModal from 'components/game-elements/GameOverModal';
import PlayerAnswersView from 'components/game-elements/PlayerAnswersScreen';
import ScoreForRoundModal from 'components/game-elements/ScoreForRoundModal';
import TallyScreen from 'components/game-elements/TallyScreen';
import { Text } from 'components/ui/Text';
import { ALPHABETS } from 'constants/index';
import SocketContext from 'contexts/SocketContext';
import { useGameStore } from 'models/gameStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

const Stack = createStackNavigator();

const GameForfeitScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <Pressable onPress={() => {}}>
        <Ionicons name="close-outline" size={100} color="red" />
      </Pressable>
      <Text>Game Forfeited</Text>
      <Text style={{ textAlign: 'center', fontSize: 16 }}>You get zero points for this round</Text>
    </View>
  );
};

const GameScreenMain = ({ route, navigation }: any) => {
  const room = route.params.room;

  const [viewingFinalTally, setViewingFinalTally] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);

  const { socket } = React.useContext(SocketContext);
  const { loadGameSoundtrack } = useSoundTrackModel();

  const handleCloseScoreModal = () => {
    // readyNextRound();
    setViewingFinalTally(false);
  };

  const {
    selectingLetter,
    playing,
    tallying,
    readyNextRound,
    updateOpponents,
    confirmLetterSelection,
    round,
    endMatch,
  } = useGameStore();

  const exitGame = () => {
    useGameStore.setState(() => ({
      room: '',
      player: {
        username: getItem('USERNAME') || 'Guest',
        answers: { Animal: '', Place: '', Thing: '' },
        score: 0,
        inTallyMode: false,
        turn: 0,
        strikes: 0,
        doneTallying: false,
        character: null,
      },
      opponents: [],
      winner: null,
      round: 0,
      activeLetter: 'A',
      totalScore: 0,
      alphabets: ALPHABETS,
      selectingLetter: true,
      playing: false,
      tallying: false,
      currentTurn: 0,
    }));
    useSoundTrackModel.setState({ matchSoundEffects: [] });
    setExiting(false);
    navigation.replace('HomeScreen');
  };
  useEffect(() => {
    if (exiting) {
      navigation.removeListener('beforeRemove', () => {});
      console.log('removed listener');
      return;
    }
    const unsub = navigation.addListener(
      'beforeRemove',
      (e: { preventDefault: () => void; data: { action: any } }) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        setExiting(true);
        // Prompt the user before leaving the screen
        // Alert.alert(
        //   'Discard changes?',
        //   'You have unsaved changes. Are you sure to discard them and leave the screen?',
        //   [
        //     { text: "Don't leave", style: 'cancel', onPress: () => {} },
        //     {
        //       text: 'Discard',
        //       style: 'destructive',
        //       // If the user confirmed, then we dispatch the action we blocked earlier
        //       // This will continue the action that had triggered the removal of the screen
        //       // onPress: () => navigation.dispatch(e.data.action),
        //       onPress: () => navigation.dispatch(e.data.action),
        //     },
        //   ]
        // );
      }
    );
    return unsub;
  }, [navigation, exiting, setExiting]);

  React.useEffect(() => {
    loadGameSoundtrack(true).then(() => {
      console.log('game loaded');
    });

    // TODO unload game soundtrack as cleanUp function
  }, []);

  React.useEffect(() => {
    socket?.on('LETTER_SELECTED', (data: { letter: string }) => {
      confirmLetterSelection(data.letter);
      setViewingFinalTally(false);
    });

    socket?.on('PLAYER_SUBMITTED', (data: { username: string; updatedPlayers: playerProps[] }) => {
      const { username, updatedPlayers } = data;
      const currentPlayerusername = getItem('USERNAME');
      const isPlayer = username === currentPlayerusername;

      if (isPlayer) {
        console.log('you submitted', currentPlayerusername);
        return;
      }
      const opponents = updatedPlayers.filter(
        (player) => player.username !== currentPlayerusername
      );

      console.log(JSON.stringify(opponents, null, 2));
      updateOpponents(opponents);
    });

    socket?.on('SHOW_FINAL_TALLY', ({ nextRound }) => {
      console.log({ nextRound, round });

      // * ignore event if players are already playing
      if (playing) {
        console.log('call to show final tally was ignored');
        return;
      }
      setViewingFinalTally(true);
      readyNextRound(nextRound);
    });

    socket?.on('TALLY_TIME_EXPIRED', ({ nextRound }) => {
      console.log('TALLY_TIME_EXPIRED', { nextRound });
    });

    socket?.on('START_COUNTDOWN', (data) => {
      console.log('Timer Started');
      // playSound('ROUND_START');
    });

    socket?.on('PLAYER_DIED', (data: { deadPlayer: string; updatedPlayers: playerProps[] }) => {
      const { deadPlayer, updatedPlayers } = data;
      const currentPlayerusername = getItem('USERNAME');
      const isPlayer = deadPlayer === currentPlayerusername;
      console.log('player died', deadPlayer);
      if (isPlayer) {
        console.log('you died', currentPlayerusername);
        return;
      }
      const opponents = updatedPlayers.filter(
        (player) => player.username !== currentPlayerusername
      );
      updateOpponents(opponents);
    });

    socket?.on('GAME_OVER', (data) => {
      endMatch();
      setGameOver(true);
      useGameStore.setState((state) => ({
        winner: data.winner,
      }));
    });

    return () => {
      socket?.off('LETTER_SELECTED');
      socket?.off('PLAYER_SUBMITTED');
      socket?.off('SHOW_FINAL_TALLY');
      socket?.off('TALLY_TIME_EXPIRED');
      socket?.off('START_COUNTDOWN');
      socket?.off('PLAYER_DIED');
      socket?.off('GAME_OVER');
    };
  }, [socket]);

  return (
    <View style={{ flex: 1 }}>
      {selectingLetter && !gameOver && <AlphabetSelectScreen socket={socket} room={room} />}
      {playing && !gameOver && <PlayerAnswersView socket={socket} room={room} />}
      {tallying && !gameOver && <TallyScreen socket={socket} room={room} />}
      <ScoreForRoundModal
        room={room}
        socket={socket}
        open={viewingFinalTally}
        handleClose={() => handleCloseScoreModal()}
      />
      {/* <Button onPress={() => socket?.emit('START_COUNTDOWN', { room })} /> */}

      {gameOver && <GameOverModal />}
      <ExitConfirmationModal onExit={exitGame} visible={exiting} setVisible={setExiting} />
    </View>
  );
};

const GameScreen = ({ route }: any) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="GameScreenMain">
      <Stack.Screen name="GameForfeitScreen" component={GameForfeitScreen} />
      <Stack.Screen
        name="GameScreenMain"
        children={({ navigation }) => <GameScreenMain route={route} navigation={navigation} />}
      />
    </Stack.Navigator>
  );
};

export default GameScreen;
