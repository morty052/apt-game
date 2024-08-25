import { useIsFocused, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExitConfirmationModal from 'components/ExitConfirmationModal';
import LoadingScreen from 'components/LoadingScreen';
import { ALPHABETS } from 'constants/index';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getItem } from 'utils/storage';

import SinglePlayerAnswersView from './components/SinglePlayerAnswersView';
import SinglePlayerLetterSelect from './components/SinglePlayerLetterSelect';
import { SinglePlayerTallyScreen } from './components/SinglePlayerTallyScreen';
import SinglePlayerGameOverModal from './partials/SinglePlayerGameOverModal';
import SinglePlayerScoreForRoundModal from './partials/SinglePlayerScoreForRoundModal';

const Stack = createStackNavigator();

function PreLoadGameScreen({ navigation }: any) {
  const { loadGameSoundtrack } = useSoundTrackModel();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    loadGameSoundtrack(true).then(() => {
      console.log('game loaded');
      navigation.navigate('SinglePlayerGameScreenMain');
    });
  }, [loadGameSoundtrack, isFocused, navigation]);

  return <LoadingScreen />;
}

function MainGameScreen({ navigation }: any) {
  const [exiting, setExiting] = useState(false);
  const { selectingLetter, playing, tallying, gameOver, viewingResults } = useSinglePlayerStore();

  const exitGame = () => {
    useSinglePlayerStore.setState(() => ({
      player: {
        username: getItem('USERNAME') || 'Guest',
        answers: { Animal: '', Place: '', Thing: '' },
        score: 0,
        character: null,
      },
      winner: null,
      round: 0,
      activeLetter: 'A',
      totalScore: 0,
      alphabets: ALPHABETS,
      selectingLetter: true,
      playing: false,
      tallying: false,
      gameOver: false,
      lives: 3,
      takenDamage: false,
    }));
    useSoundTrackModel.setState({ matchSoundEffects: [] });
    setExiting(false);
    console.log('gdgdgdgdgdgdg');
    navigation.navigate('HomeScreen');
  };
  useEffect(() => {
    navigation.addListener(
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
  }, []);
  return (
    <View style={styles.container}>
      {selectingLetter && !gameOver && <SinglePlayerLetterSelect />}
      {playing && !gameOver && <SinglePlayerAnswersView />}
      {tallying && !gameOver && <SinglePlayerTallyScreen />}
      {gameOver && <SinglePlayerGameOverModal />}
      {viewingResults && <SinglePlayerScoreForRoundModal open={viewingResults} />}
      <ExitConfirmationModal onExit={exitGame} visible={exiting} setVisible={setExiting} />
    </View>
  );
}

// TODO
// ! FIX SOUNDS PLAYING TWICE ON MOUNT
export default function SinglePlayerGame({ navigation }: any) {
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
