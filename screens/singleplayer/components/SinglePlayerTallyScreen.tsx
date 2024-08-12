import { SinglePlayerHud } from 'components/game-elements/Hud';
import { SinglePlayerCard } from 'components/game-elements/PlayerCard';
import { Button } from 'components/ui/Button';
import { baseUrl } from 'constants/index';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { answerProps } from 'types';
import { View, StyleSheet } from 'react-native';
import { Text } from 'components/ui/Text';
import SinglePlayerScoreForRoundModal from '../partials/SinglePlayerScoreForRoundModal';

const verifySinglePlayerAnswer = async (payload: answerProps) => {
  const data = await fetch(`${baseUrl}/api/verify-answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const res = await data.json();

  const verdict = JSON.parse(res.verdict);

  console.log({ isReal: verdict.isReal });

  return { isReal: verdict.isReal, wrongItems: verdict.wrongItems };
};

export const SinglePlayerTallyScreen = () => {
  const [verifyingAnswer, setVerifyingAnswer] = useState(false);
  const [viewingFinalTally, setViewingFinalTally] = useState(false);

  const { player } = useSinglePlayerStore();

  const { answers } = player;

  const { playSound } = useSoundTrackModel();

  const handleBurstAnswer = useCallback(
    (wrongItems: any) => {
      const answerEntries = Object.entries(answers);
      const updatedAnswers = answerEntries.map(([key, value]) => {
        if (wrongItems.includes(value)) {
          return { [key]: 'BUSTED' };
        }
        return { [key]: value };
      });
      const newAnswers = Object.assign({}, ...updatedAnswers);
      console.log({ answerEntries, updatedAnswers, newAnswers });
      useSinglePlayerStore.setState((state) => ({
        player: {
          ...state.player,
          answers: newAnswers,
        },
      }));
      // return;
    },
    [answers]
  );

  const handleForfeitedAnswers = useCallback(
    (forfeitedAnswers: string[]) => {
      const answerEntries = Object.entries(answers);
      const updatedAnswers = answerEntries.map(([key, value]) => {
        if (forfeitedAnswers.includes(value as any)) {
          return { [key]: 'FORFEITED' };
        }
        return { [key]: value };
      });
      const newAnswers = Object.assign({}, ...updatedAnswers);
      console.log({ answerEntries, updatedAnswers, newAnswers });
      useSinglePlayerStore.setState((state) => ({
        player: {
          ...state.player,
          answers: newAnswers,
        },
      }));
    },
    [answers, useSinglePlayerStore]
  );

  const handleTally = useCallback(async () => {
    setVerifyingAnswer(true);
    const hasForfeitedAnswers = Object.values(answers)
      .filter((a) => a !== 'FORFEITED')
      .filter((a) => a === '');
    if (hasForfeitedAnswers.length > 0) {
      console.log({ hasForfeitedAnswers, answers, values: Object.values(answers) });
      useSinglePlayerStore.setState((state) => ({ lives: state.lives - 1 }));
      handleForfeitedAnswers(hasForfeitedAnswers);
      setViewingFinalTally(true);
      setVerifyingAnswer(false);
      return;
    }
    const { isReal, wrongItems } = await verifySinglePlayerAnswer(answers);
    if (!isReal) {
      console.log(wrongItems);
      handleBurstAnswer(wrongItems);
      useSinglePlayerStore.setState((state) => ({ lives: state.lives - 1 }));
    }
    setVerifyingAnswer(false);
    setViewingFinalTally(true);
  }, [
    answers,
    handleBurstAnswer,
    handleForfeitedAnswers,
    setViewingFinalTally,
    setVerifyingAnswer,
    useSinglePlayerStore,
  ]);

  const handleCloseScoreModal = () => {
    // readyNextRound();
    setViewingFinalTally(false);
  };

  return (
    <>
      {/* <FinalTallYModal open={viewingFinalTally} handleClose={() => handleCloseTallyScreen()} /> */}
      <SafeAreaView style={styles.alphabetScreencontainer}>
        <View onLayout={() => playSound('ROUND_END')} style={{ paddingHorizontal: 10, gap: 20 }}>
          <SinglePlayerHud />
          <SinglePlayerCard username={player.username} />

          <Button title="Ready" onPress={handleTally}>
            <Text>{verifyingAnswer ? 'Verifying...' : 'Ready'}</Text>
          </Button>
        </View>
      </SafeAreaView>
      <SinglePlayerScoreForRoundModal
        open={viewingFinalTally}
        handleClose={handleCloseScoreModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingTop: 10,
  },
  gameScreen: {
    flex: 1,
  },
  alphabetScreencontainer: {
    flex: 1,
    backgroundColor: '#00c4ee',
    gap: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  alphabetButton: {
    height: 80,
    width: 80,
    backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  alphabet: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});
