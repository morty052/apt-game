import LoadingScreen from 'components/LoadingScreen';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SinglePlayerAnswersView from './components/SinglePlayerAnswersView';
import SinglePlayerLetterSelect from './components/SinglePlayerLetterSelect';
import { SinglePlayerTallyScreen } from './components/SinglePlayerTallyScreen';
import { Text } from 'components/ui/Text';

// TODO
// ! FIX SOUNDS PLAYING TWICE ON MOUNT
export default function SinglePlayerGame() {
  const [loadedSounds, setloadedSounds] = useState(false);

  const { loadGameSoundtrack } = useSoundTrackModel();
  const { selectingLetter, playing, tallying, gameOver } = useSinglePlayerStore();

  useEffect(() => {
    if (loadedSounds) return;
    loadGameSoundtrack(true).then(() => {
      console.log('game loaded');
      setloadedSounds(true);
    });
  }, [loadedSounds]);

  if (!loadedSounds) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {selectingLetter && !gameOver && <SinglePlayerLetterSelect />}
      {playing && !gameOver && <SinglePlayerAnswersView />}
      {tallying && !gameOver && <SinglePlayerTallyScreen />}
      {gameOver && (
        <View>
          <Text>Game Over</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
