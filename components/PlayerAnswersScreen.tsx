import { useGameStore } from 'models/gameStore';
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocketProps } from 'types';
import { getItem } from 'utils/storage';

import HUD from './Hud';
import { Mic } from './Mic';
import { Button } from './ui/Button';

// * All background colors
const backgroundColors = {
  0: '#00c4ee',
  1: 'purple',
  2: 'orange',
  3: 'pink',
};

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

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
          {/* <Ionicons
              name="chevron-back"
              size={24}
              color="white"
              onPress={() => {
                if (index - 1 < 0) {
                  setIndex(3);
                  return;
                }
                setIndex(index - 1);
              }}
            /> */}
          <Text
            style={{
              color: 'white',
              fontSize: 28,
              fontWeight: '700',
              textAlign: 'center',
            }}>
            {title}
          </Text>
          {/* <Ionicons
              name="chevron-forward"
              size={24}
              color="white"
              onPress={() => {
                if (index + 1 > 3) {
                  setIndex(0);
                  return;
                }
                setIndex(index + 1);
              }}
            /> */}
        </View>
        <TextInput
          style={{
            height: 50,
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            color: 'white',
            fontSize: 20,
            width: '100%',
          }}
          value={value}
          onChangeText={(value) => setValue((prev) => ({ ...prev, [title]: value }))}
        />
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

  const { readyTallyMode } = useGameStore();

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
    readyTallyMode(answers);
  }

  function handleAnswerSubmit(title: string, value: string) {
    //* handle empty answers
    if (!value) {
      //* update value to "FORFEITED"
      setAnswers((prev) => ({ ...prev, [title]: 'FORFEITED' }));
    }

    // * handle last answer
    if (index === 3) {
      console.log('last');
      if (!value) {
        console.log('title is', title);
        //* update value to "FORFEITED"
        setAnswers((prev) => ({ ...prev, [title]: 'FORFEITED' }));
      }
      handlePlayerFinish();
      return;
    }

    handleIndexChange();
  }

  React.useEffect(() => {
    socket?.on('TIME_UP', () => {
      console.log("Time's up");
      // socket?.emit('START_COUNTDOWN', { room })
      readyTallyMode(answers);
    });
  }, [socket]);

  return (
    <AnimatedSafeAreaView style={[{ flex: 1, gap: 20, paddingTop: 10 }, animatedStyles]}>
      <View style={{ paddingHorizontal: 10 }}>
        <HUD socket={socket} />
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
