import AlphabetSelectScreen from 'components/AlphabetSelectScreen';
import PlayerAnswersView from 'components/PlayerAnswersScreen';
import ScoreForRoundModal from 'components/ScoreForRoundModal';
import TallyScreen from 'components/TallyScreen';
import { Button } from 'components/ui/Button';
import SocketContext from 'contexts/SocketContext';
import { getPointsForPlayer, useGameStore } from 'models/gameStore';
import React from 'react';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

export const GameScreen = ({ route }: any) => {
  const [viewingFinalTally, setViewingFinalTally] = React.useState(false);
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
  } = useGameStore();

  React.useEffect(() => {
    socket?.on('LETTER_SELECTED', (data: { letter: string }) => {
      confirmLetterSelection(data.letter);
    });

    socket?.on('PLAYER_SUBMITTED', (data: { username: string; updatedPlayers: playerProps[] }) => {
      const { username, updatedPlayers } = data;
      const currentPlayerusername = getItem('USERNAME');
      const isPlayer = username === currentPlayerusername;

      if (isPlayer) {
        console.log('you submitted');
        return;
      }
      const opponents = updatedPlayers.filter(
        (player) => player.username !== currentPlayerusername
      );
      // updateOpponents(opponents);
    });

    // socket?.on('ALL_PLAYERS_SUBMITTED', (data: { updatedPlayers: playerProps[] }) => {
    //   const { updatedPlayers } = data;
    //   const currentPlayerusername = getItem('USERNAME');

    //   console.log('All players submitted');

    //   const opponents = updatedPlayers.filter(
    //     (player) => player.username !== currentPlayerusername
    //   );

    //   updateOpponents(opponents);
    // });

    socket?.on('SHOW_FINAL_TALLY', () => {
      setViewingFinalTally(true);
      readyNextRound();
    });
    socket?.on('START_COUNTDOWN', (data) => {
      console.log(data);
    });

    // socket?.on('READY_NEXT_ROUND', () => {
    //   readyNextRound();
    // });
  }, [socket]);

  return (
    <>
      {selectingLetter && <AlphabetSelectScreen socket={socket} room={room} />}
      {playing && <PlayerAnswersView socket={socket} room={room} />}
      {tallying && <TallyScreen socket={socket} room={room} />}
      <ScoreForRoundModal open={viewingFinalTally} handleClose={() => handleCloseScoreModal()} />
      {/* <Button onPress={() => socket?.emit('START_COUNTDOWN', { room })} /> */}
    </>
  );
};
