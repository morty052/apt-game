import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from 'components/LoadingScreen';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SinglePlayerAnswersView from './components/SinglePlayerAnswersView';
import SinglePlayerLetterSelect from './components/SinglePlayerLetterSelect';
import { SinglePlayerTallyScreen } from './components/SinglePlayerTallyScreen';
import SinglePlayerGameOverModal from './partials/SinglePlayerGameOverModal';
import SinglePlayerScoreForRoundModal from './partials/SinglePlayerScoreForRoundModal';

const Stack = createStackNavigator();

function PreLoadGameScreen({ navigation }: any) {
  const { loadGameSoundtrack } = useSoundTrackModel();

  useEffect(() => {
    loadGameSoundtrack(true).then(() => {
      console.log('game loaded');
      navigation.navigate('SinglePlayerGameScreenMain');
    });
  }, [loadGameSoundtrack]);

  return <LoadingScreen />;
}

function MainGameScreen() {
  const { selectingLetter, playing, tallying, gameOver, viewingResults } = useSinglePlayerStore();
  return (
    <View style={styles.container}>
      {selectingLetter && !gameOver && <SinglePlayerLetterSelect />}
      {playing && !gameOver && <SinglePlayerAnswersView />}
      {tallying && !gameOver && <SinglePlayerTallyScreen />}
      {gameOver && <SinglePlayerGameOverModal />}
      {viewingResults && <SinglePlayerScoreForRoundModal open={viewingResults} />}
    </View>
  );
}

// TODO
// ! FIX SOUNDS PLAYING TWICE ON MOUNT
export default function SinglePlayerGame() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SinglePlayerLoader">
      <Stack.Screen name="SinglePlayerLoader" component={PreLoadGameScreen} />
      <Stack.Screen name="SinglePlayerGameScreenMain" component={MainGameScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
