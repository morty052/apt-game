import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useGameStore } from 'models/gameStore';

const Timer = ({ seconds }: { seconds: number }) => {
  const [playing, setplaying] = React.useState(false);

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
