import * as Haptics from 'expo-haptics';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useCallback, useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text } from 'components/ui/Text';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { answerProps } from 'types';
import { Mic } from 'components/game-elements/Mic';
import { Button } from 'components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSinglePlayerTimer } from 'components/game-elements/Timer';
import { SinglePlayerHud } from 'components/game-elements/Hud';

const backgroundColors = {
  0: '#00c4ee',
  1: 'purple',
  2: 'orange',
  3: 'pink',
};

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const GameTextInput = ({
  value,
  setValue,
  title,
  handlePlayerInput,
  error,
  setError,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<answerProps>>;
  title: string;
  handlePlayerInput: (value: string) => void;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const borderColor = useSharedValue('white');

  const textStyles = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(!error ? borderColor.value : 'red', { duration: 100 }),
    };
  });

  return (
    <AnimatedTextInput
      maxLength={25}
      onFocus={() => setError(false)}
      style={[
        {
          height: 50,
          borderColor: 'white',
          borderWidth: 4,
          borderRadius: 10,
          paddingHorizontal: 10,
          color: 'white',
          fontSize: 20,
          width: '100%',
          fontFamily: 'Crispy-Tofu',
          textAlign: 'center',
        },
        textStyles,
      ]}
      value={value}
      onChangeText={(value) => handlePlayerInput(value)}
    />
  );
};

const SinglePlayerView = ({
  title,
  value,
  setValue,
  handleSubmit,
}: {
  title: string;
  value: string;
  setValue: React.Dispatch<
    React.SetStateAction<{ Name: string; Animal: string; Place: string; Thing: string }>
  >;
  handleSubmit: (title: string, value: string) => void;
}) => {
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState<string | undefined>('');

  const [error, setError] = useState(false);

  const { activeLetter } = useSinglePlayerStore();

  const { playSound } = useSoundTrackModel();

  const handlePlayerInput = useCallback(
    async (value: string) => {
      if (!value) {
        setValue((prev) => ({ ...prev, [title]: '' }));
        return;
      }

      if (value.toLowerCase().startsWith(activeLetter.toLowerCase())) {
        setError(false);
      }

      if (!value.toLowerCase().startsWith(activeLetter.toLowerCase())) {
        setError(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        playSound('WRONG_LETTER');
        return;
        // setValue((prev) => ({ ...prev, [title]: '' }));
      }

      setValue((prev) => ({ ...prev, [title]: value }));
    },
    [activeLetter, title, setValue, value]
  );

  return (
    <View
      style={{
        paddingHorizontal: 10,
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 30,
      }}>
      <View
        style={{
          gap: 10,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 100,
        }}>
        <View
          style={{
            // flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingBottom: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 30,
              textAlign: 'center',
            }}>
            {title}
          </Text>
        </View>
        <GameTextInput
          error={error}
          setError={setError}
          handlePlayerInput={handlePlayerInput}
          title={title}
          value={value}
          setValue={setValue}
        />
        <View style={{ alignSelf: 'center', paddingTop: 20 }}>
          <Mic
            results={results}
            setResults={(results) => handlePlayerInput(results as string)}
            listening={listening}
            setListening={setListening}
          />
        </View>
      </View>
      <View>
        <Button onPress={() => handleSubmit(title, value)} title={value ? 'Submit' : 'Skip'} />
      </View>
    </View>
  );
};

const SinglePlayerAnswersView = () => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({
    Name: '',
    Animal: '',
    Place: '',
    Thing: '',
  });

  const { readyTallyMode, updateAnswers } = useSinglePlayerStore();
  const { playSound } = useSoundTrackModel();

  const { seconds, timeUp } = useSinglePlayerTimer();

  const color = useSharedValue(backgroundColors[0]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: color.value,
    };
  });

  const handleIndexChange = useCallback(() => {
    //* Increase current index
    const newValue = index + 1;

    // * Move to next answer
    setIndex(newValue);

    // * change color of background
    color.value = withTiming(backgroundColors[newValue as keyof typeof backgroundColors]);
  }, [backgroundColors, setIndex, index]);

  const handlePlayerFinish = useCallback(() => {
    readyTallyMode();
  }, [readyTallyMode]);

  const handleAnswerSubmit = useCallback(
    (title: string, value: string) => {
      //* handle empty answers
      if (!value) {
        //* update value to "FORFEITED"
        setAnswers((prev) => ({ ...prev, [title]: 'FORFEITED' }));
        updateAnswers({ answer: 'FORFEITED', field: title });
      }

      // * handle last answer
      if (index === 3) {
        console.log('last');
        if (!value) {
          console.log('title is', title);
          //* update value to "FORFEITED"
          setAnswers((prev) => ({ ...prev, [title]: 'FORFEITED' }));
          updateAnswers({ answer: 'FORFEITED', field: title });
        }
        updateAnswers({ answer: value, field: title });
        handlePlayerFinish();
        return;
      }

      updateAnswers({ answer: value, field: title });
      handleIndexChange();
    },
    [index, updateAnswers, setAnswers, handlePlayerFinish, updateAnswers, handleIndexChange]
  );

  // * Watch for clock
  useEffect(() => {
    if (!timeUp) {
      return;
    }

    handlePlayerFinish();
  }, [timeUp]);

  return (
    <AnimatedSafeAreaView style={[{ flex: 1, gap: 20, paddingTop: 10 }, animatedStyles]}>
      <View onLayout={() => playSound('ROUND_START')} style={{ paddingHorizontal: 10 }}>
        <SinglePlayerHud seconds={seconds} />
      </View>
      <>
        {index === 0 && (
          <SinglePlayerView
            handleSubmit={(title, value) => handleAnswerSubmit(title, value)}
            value={answers.Name}
            setValue={setAnswers}
            title="Name"
          />
        )}
        {index === 1 && (
          <SinglePlayerView
            handleSubmit={(title, value) => handleAnswerSubmit(title, value)}
            value={answers.Animal}
            setValue={setAnswers}
            title="Animal"
          />
        )}
        {index === 2 && (
          <SinglePlayerView
            handleSubmit={(title, value) => handleAnswerSubmit(title, value)}
            value={answers.Place}
            setValue={setAnswers}
            title="Place"
          />
        )}
        {index === 3 && (
          <SinglePlayerView
            handleSubmit={(title, value) => handleAnswerSubmit(title, value)}
            value={answers.Thing}
            setValue={setAnswers}
            title="Thing"
          />
        )}
      </>
    </AnimatedSafeAreaView>
  );
};

export default SinglePlayerAnswersView;
