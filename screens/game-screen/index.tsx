import AlphabetSelectScreen from 'components/AlphabetSelectScreen';
import GameOverModal from 'components/GameOverModal';
import PlayerAnswersView from 'components/PlayerAnswersScreen';
import ScoreForRoundModal from 'components/ScoreForRoundModal';
import TallyScreen from 'components/TallyScreen';
import SocketContext from 'contexts/SocketContext';
import { useGameStore } from 'models/gameStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import React from 'react';
import { View } from 'react-native';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

const GameScreen = ({ route }: any) => {
  const room = route.params.room;

  const [viewingFinalTally, setViewingFinalTally] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);

  const { socket } = React.useContext(SocketContext);
  const { playSound, loadGameSoundtrack } = useSoundTrackModel();

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
    player,
    opponents,
  } = useGameStore();

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
      playSound('SCORE_FOR_ROUND_SOUND');
      readyNextRound(nextRound);
    });

    socket?.on('TALLY_TIME_EXPIRED', ({ nextRound }) => {
      console.log('TALLY_TIME_EXPIRED', { nextRound });
    });

    socket?.on('START_COUNTDOWN', (data) => {
      console.log('Timer Started');
      playSound('ROUND_START');
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
      console.log(data);
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
    </View>
  );
};

export default GameScreen;
