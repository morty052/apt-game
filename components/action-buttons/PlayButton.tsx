import useSound from 'hooks/useSound';
import React from 'react';
import { Pressable, StyleSheet, Text, View, Button } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { Audio } from 'expo-av';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Test() {
  const [sound, setSound] = React.useState<null | Audio.Sound>(null);

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/wrongletter.mp3'));
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  // React.useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log('Unloading Sound');
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
}

export default function PlayButton({ onPress }: { onPress: () => void }) {
  const { playSound } = useSound();
  const width = useSharedValue(100);

  return (
    // <Pressable onPress={onPress} style={[styles.container]}>
    //   <Text style={styles.playText}>Play</Text>
    // </Pressable>
    <Test />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'yellow',
    height: 100,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'gold',
  },
  playText: {
    color: 'black',
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'Crispy-Tofu',
    textAlign: 'center',
  },
});
