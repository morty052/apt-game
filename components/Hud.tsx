import { useGameStore } from 'models/gameStore';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Socket } from 'socket.io-client';

import Timer from './Timer';

const HUD = ({ socket }: { socket: Socket | null }) => {
  const [seconds, setSeconds] = React.useState(30);
  const { activeLetter, playing, totalScore } = useGameStore();

  React.useEffect(() => {
    socket?.on('DECREASE_SECONDS', (data) => {
      const { seconds } = data;
      setSeconds(seconds);
    });
  }, [socket]);

  return (
    <View style={styles.container}>
      <Text>{activeLetter}</Text>
      <Text>{totalScore}</Text>
      {playing && <Timer seconds={seconds} />}
    </View>
  );
};

export default HUD;

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'white',
  },
});
