import { useGameStore } from 'models/gameStore';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const useSinglePlayerTimer = () => {
  const [seconds, setSeconds] = React.useState(30);
  const [timeUp, setTimeUp] = React.useState(false);

  const { playing } = useSinglePlayerStore();

  React.useEffect(() => {
    if (!playing) {
      return;
    }
    const dec = setInterval(() => {
      setSeconds((prev) => prev - 1);
      if (seconds === 0) {
        setTimeUp(true);
        setSeconds(30);
      }
    }, 1000);

    return () => clearInterval(dec);
  }, [seconds, playing]);

  return { seconds, timeUp };
};

export const usePlayingTime = () => {
  const [seconds, setSeconds] = React.useState(30);
  const [timeUp] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  const { playing } = useGameStore();

  React.useEffect(() => {
    if (!playing || paused) {
      return;
    }
    const dec = setInterval(() => {
      setSeconds((prev) => prev - 1);
      if (seconds === 0) {
        // setTimeUp(true);
        setSeconds(30);
      }
    }, 1000);

    return () => clearInterval(dec);
  }, [seconds, playing, paused]);

  return { seconds, timeUp, setPaused, paused };
};

export const useTallyTime = () => {
  const [seconds, setSeconds] = React.useState(30);
  const [timeUp] = React.useState(false);
  const [paused, setPaused] = React.useState(true);

  const { tallying } = useGameStore();

  React.useEffect(() => {
    if (!tallying || paused) {
      return;
    }
    const dec = setInterval(() => {
      setSeconds((prev) => prev - 1);
      if (seconds === 0) {
        // setTimeUp(true);
        setSeconds(30);
      }
    }, 1000);

    return () => clearInterval(dec);
  }, [seconds, tallying, paused]);

  return { seconds, timeUp, setPaused, paused };
};

const Timer = () => {
  const [seconds, setSeconds] = React.useState(10);

  const { playing } = useGameStore();

  React.useEffect(() => {
    if (!playing) {
      return;
    }
    const dec = setInterval(() => {
      setSeconds((prev) => prev - 1);
      if (seconds === 0) {
        // setTimeUp(true);
        setSeconds(10);
      }
    }, 1000);

    return () => clearInterval(dec);
  }, [seconds, playing]);

  return (
    <View style={styles.container}>
      <Text>{seconds}</Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
