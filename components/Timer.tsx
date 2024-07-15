import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useGameStore } from 'models/gameStore';

const Timer = ({}: { seconds: number }) => {
  const [seconds, setSeconds] = React.useState(10);
  const [timeUp, setTimeUp] = React.useState(false);

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
