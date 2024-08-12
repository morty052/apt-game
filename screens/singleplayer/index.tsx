import LoadingScreen from 'components/LoadingScreen';
import { SinglePlayerAnswersView } from 'components/game-elements/PlayerAnswersScreen';
import ScoreForRoundModal from 'components/game-elements/ScoreForRoundModal';
import { SinglePlayerTallyScreen } from 'components/game-elements/TallyScreen';
import { useGameStore } from 'models/gameStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SinglePlayerLetterSelect from './components/SinglePlayerLetterSelect';

// TODO
// ! FIX SOUNDS PLAYING TWICE ON MOUNT
export default function SinglePlayerGame() {
  const [viewingFinalTally, setViewingFinalTally] = useState(false);
  const [loadedSounds, setloadedSounds] = useState(false);
  const [gameOver, setgameOver] = useState(false);

  const { loadGameSoundtrack } = useSoundTrackModel();
  const { selectingLetter, playing, tallying } = useGameStore();

  const handleLoadSounds = () => {
    loadGameSoundtrack(true).then(() => {
      console.log('game loaded');
      setloadedSounds(true);
    });
  };

  const handleCloseScoreModal = () => {
    // readyNextRound();
    setViewingFinalTally(false);
  };

  useEffect(() => {
    handleLoadSounds();
  }, []);

  if (!loadedSounds) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {selectingLetter && !gameOver && <SinglePlayerLetterSelect />}
      {playing && !gameOver && <SinglePlayerAnswersView />}
      {tallying && !gameOver && <SinglePlayerTallyScreen />}
      <ScoreForRoundModal
        isSinglePlayer
        open={viewingFinalTally}
        handleClose={() => handleCloseScoreModal()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
