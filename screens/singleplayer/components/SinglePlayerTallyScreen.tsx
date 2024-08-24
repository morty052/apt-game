import { checkWord } from 'api';
import { SinglePlayerHud } from 'components/game-elements/Hud';
import { SinglePlayerCard } from 'components/game-elements/PlayerCard';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { baseUrl } from 'constants/index';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { answerProps } from 'types';

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

const useTally = () => {
  const [verifyingAnswer, setVerifyingAnswer] = useState(false);
  const { player, lives } = useSinglePlayerStore();
  const { answers } = player;
  const { playSound } = useSoundTrackModel();

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

  const handlePlayerDeath = useCallback(() => {
    if (lives - 1 < 0) {
      useSinglePlayerStore.setState((state) => ({ gameOver: true, takenDamage: true }));
      console.log('player died');
      return true;
    }
    useSinglePlayerStore.setState((state) => ({ lives: state.lives - 1 }));
    console.log('Damage taken');
  }, [lives, useSinglePlayerStore]);

  const handleTally = useCallback(async () => {
    // * RETURN IF ALREADY VERIFYING
    // if (verifyingAnswer) {
    //   return;
    // }

    try {
      // * SET VERIFYING ANSWER TO TRUE
      setVerifyingAnswer(true);
      // * CHECK IF CHARACTER FORFEITED ANY ANSWER
      const hasForfeitedAnswers = Object.values(answers)
        .filter((a) => a !== 'FORFEITED')
        .filter((a) => a === '');

      // * HANDLE FORFEITED ANSWER
      if (hasForfeitedAnswers.length > 0) {
        // * REDUCE PLAYER LIVES THEN CHECK IF PLAYER IS DEAD
        const playerDied = handlePlayerDeath();
        // * HANDLE PLAYER DEATH
        if (playerDied) {
          return;
        }
        // * SET FORFEITED ANSWERS TO 'FORFEITED'
        handleForfeitedAnswers(hasForfeitedAnswers);
        setVerifyingAnswer(false);

        // * OPEN SCORE FOR ROUND MODAL, UPDATE DAMAGE TAKEN VARIABLE
        useSinglePlayerStore.setState({ viewingResults: true, takenDamage: true });
        return;
      }

      // * CHECK IF PLAYER PUT IN CORRECT ANSWERS FOR THING
      const { isInDatabase, error } = await checkWord({
        word: answers.Thing,
      });

      if (!isInDatabase) {
        console.error(error);
        return;
      }

      // * CHECK IF PLAYER PUT IN WRONG ANSWERS
      const { isReal, wrongItems } = await verifySinglePlayerAnswer(answers);

      // * IF PLAYER PUT IN WRONG ANSWERS
      if (!isReal) {
        console.log(wrongItems);

        // * CHANGE ANSWER VALUE TO BUSTED
        handleBurstAnswer(wrongItems);

        // * REDUCE PLAYER LIVES THEN CHECK IF PLAYER IS DEAD
        const playerDied = handlePlayerDeath();

        // * HANDLE PLAYER DEATH
        if (playerDied) {
          return;
        }
        // * UPDATE DAMAGE TAKEN VARIABLE
        useSinglePlayerStore.setState({ takenDamage: true });
      }

      setVerifyingAnswer(false);

      // * OPEN SCORE FOR ROUND MODAL
      useSinglePlayerStore.setState({ viewingResults: true });
    } catch (error) {
      console.error(error);
    }
  }, [
    answers,
    handleBurstAnswer,
    handleForfeitedAnswers,
    setVerifyingAnswer,
    useSinglePlayerStore,
  ]);

  useEffect(() => {
    playSound('ROUND_END');
  }, [playSound]);

  return { handleTally, verifyingAnswer, player };
};

export const SinglePlayerTallyScreen = () => {
  const { handleTally, verifyingAnswer, player } = useTally();

  return (
    <>
      {/* <FinalTallYModal open={viewingFinalTally} handleClose={() => handleCloseTallyScreen()} /> */}
      <SafeAreaView style={styles.alphabetScreencontainer}>
        <View onLayout={() => {}} style={{ paddingHorizontal: 10, gap: 20 }}>
          <SinglePlayerHud />
          <SinglePlayerCard username={player.username} />

          <Button title="Ready" onPress={handleTally}>
            <Text>{verifyingAnswer ? 'Verifying...' : 'Ready'}</Text>
          </Button>
        </View>
      </SafeAreaView>
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
