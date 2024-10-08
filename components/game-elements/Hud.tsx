import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from 'models/gameStore';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../ui/Text';

export const SinglePlayerHud = ({ seconds }: { seconds?: number }) => {
  const { activeLetter, totalScore, tallying, lives } = useSinglePlayerStore();

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
      {!tallying && (
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
      )}
      {tallying && (
        <View style={{}}>
          <View
            style={{
              backgroundColor: 'white',
              height: 40,
              width: 40,
              borderRadius: 10,
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="heart" size={35} color="red" />
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 3,
              }}>
              <Text style={{ color: 'white', fontSize: 16 }}>{lives}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const HUD = ({ seconds, isSinglePlayer }: { seconds: number; isSinglePlayer?: boolean }) => {
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
      {isSinglePlayer && (
        <View style={{ position: 'absolute', right: 10, top: 51 }}>
          <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 10 }}>
            <Ionicons name="heart" size={30} color="red" />
          </View>
        </View>
      )}
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
    position: 'relative',
  },
});
