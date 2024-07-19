import AlphabetSelectScreen from 'components/AlphabetSelectScreen';
import PlayerAnswersView from 'components/PlayerAnswersScreen';
import ScoreForRoundModal from 'components/ScoreForRoundModal';
import TallyScreen from 'components/TallyScreen';
import { Button } from 'components/ui/Button';
import SocketContext from 'contexts/SocketContext';
import { getPointsForPlayer, useGameStore } from 'models/gameStore';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';
import { Text } from 'react-native';

export const GameScreen = ({ route }: any) => {
  const [viewingFinalTally, setViewingFinalTally] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const room = route.params.room;

  const { socket } = React.useContext(SocketContext);

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
  } = useGameStore();

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
      // console.log(data);
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

    socket?.on('GAME_OVER', () => {
      setGameOver(true);
    });
  }, [socket]);

  return (
    <>
      {selectingLetter && !gameOver && <AlphabetSelectScreen socket={socket} room={room} />}
      {playing && !gameOver && <PlayerAnswersView socket={socket} room={room} />}
      {tallying && !gameOver && <TallyScreen socket={socket} room={room} />}
      <ScoreForRoundModal open={viewingFinalTally} handleClose={() => handleCloseScoreModal()} />
      {/* <Button onPress={() => socket?.emit('START_COUNTDOWN', { room })} /> */}

      {gameOver && (
        <SafeAreaView style={{ flex: 1 }}>
          <Text>Game Over</Text>
        </SafeAreaView>
      )}
    </>
  );
};
