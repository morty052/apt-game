import { useGameStore } from 'models/gameStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../ui/Text';

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
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: 'gold',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ color: 'black' }}>{activeLetter}</Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ color: 'white' }}>{totalScore}</Text>
      </View>
      {/* {playing && <Timer />} */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: 'gold',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ color: 'black' }}>{seconds}</Text>
      </View>
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
