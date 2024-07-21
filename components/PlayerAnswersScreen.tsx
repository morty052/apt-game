import { useGameStore } from 'models/gameStore';
import React from 'react';
import { View, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { answerProps, SocketProps } from 'types';
import { getItem } from 'utils/storage';

import HUD from './Hud';
import { Mic } from './Mic';
import { usePlayingTime } from './Timer';
import { Button } from './ui/Button';
import { Text } from './ui/Text';
import useSound from 'hooks/useSound';

// * All background colors
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
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<answerProps>>;
  title: string;
}) => {
  const [error, setError] = React.useState(false);

  const { activeLetter } = useGameStore();

  const { playSound, sound } = useSound();

  const borderColor = useSharedValue('white');

  const textStyles = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(!error ? borderColor.value : 'red', { duration: 100 }),
    };
  });

  const handlePlayerInput = React.useCallback(
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
        await playSound();
        await sound?.unloadAsync();
        return;
        // setValue((prev) => ({ ...prev, [title]: '' }));
      }

      setValue((prev) => ({ ...prev, [title]: value }));
    },
    [activeLetter, title, setValue, value]
  );

  return (
    <AnimatedTextInput
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

const AnswerView = ({
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
        <GameTextInput title={title} value={value} setValue={setValue} />
        <View style={{ alignSelf: 'center', paddingTop: 20 }}>
          {/* @ts-ignore */}
          <Mic />
        </View>
      </View>
      <View>
        <Button onPress={() => handleSubmit(title, value)} title={value ? 'Submit' : 'Skip'} />
      </View>
    </View>
  );
};

const PlayerAnswersView = ({ socket, room }: { socket: SocketProps | null; room: string }) => {
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState({
    Name: '',
    Animal: '',
    Place: '',
    Thing: '',
  });

  const { readyTallyMode, updateAnswers } = useGameStore();

  const { seconds } = usePlayingTime();

  const color = useSharedValue(backgroundColors[0]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: color.value,
    };
  });

  function handleIndexChange() {
    //* Increase current index
    const newValue = index + 1;

    // * Move to next answer
    setIndex(newValue);

    // * change color of background
    color.value = withTiming(backgroundColors[newValue as keyof typeof backgroundColors]);
  }

  function handlePlayerFinish() {
    socket?.emit('SUBMIT_ANSWERS', {
      room,
      player: {
        username: getItem('USERNAME'),
        answers,
      },
    });
    readyTallyMode();
  }

  function handleAnswerSubmit(title: string, value: string) {
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
  }

  // * Watch for clock
  React.useEffect(() => {
    socket?.on('TIME_UP', () => {
      // * here because socket does not get updated answers
      const answerObject = Object.assign({}, answers);

      // * handle empty answers
      Object.keys(answerObject).forEach((key) => {
        if (answerObject[key as keyof typeof answerObject] === '') {
          answerObject[key as keyof typeof answerObject] = 'FORFEITED';
        }
      });

      // * send answers to server
      // socket?.emit('SUBMIT_ANSWERS', {
      //   room,
      //   player: {
      //     username: getItem('USERNAME'),
      //     answers: answerObject,
      //   },
      // });

      // * change ui to tally ui
      // readyTallyMode();
    });

    return () => {
      socket?.off('TIME_UP');
    };
  }, [socket, answers]);

  return (
    <AnimatedSafeAreaView style={[{ flex: 1, gap: 20, paddingTop: 10 }, animatedStyles]}>
      <View style={{ paddingHorizontal: 10 }}>
        <HUD seconds={seconds} />
      </View>
      <>
        {index === 0 && (
          <AnswerView
            handleSubmit={(title, value) => handleAnswerSubmit(title, value)}
            value={answers.Name}
            setValue={setAnswers}
            title="Name"
          />
        )}
        {index === 1 && (
          <AnswerView
            handleSubmit={(title, value) => handleAnswerSubmit(title, value)}
            value={answers.Animal}
            setValue={setAnswers}
            title="Animal"
          />
        )}
        {index === 2 && (
          <AnswerView
            handleSubmit={(title, value) => handleAnswerSubmit(title, value)}
            value={answers.Place}
            setValue={setAnswers}
            title="Place"
          />
        )}
        {index === 3 && (
          <AnswerView
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

export default PlayerAnswersView;
