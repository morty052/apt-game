import { useGameStore } from 'models/gameStore';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HUD = ({ seconds }: { seconds: number }) => {
  const { activeLetter, totalScore, round } = useGameStore();

  // React.useEffect(() => {
  //   socket?.on('DECREASE_SECONDS', (data) => {
  //     const { seconds } = data;
  //     setSeconds(seconds);
  //   });
  // }, [socket]);

  return (
    <View style={styles.container}>
      <Text>{activeLetter}</Text>
      <Text>{round}</Text>
      {/* {playing && <Timer />} */}
      <Text>{seconds}</Text>
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
