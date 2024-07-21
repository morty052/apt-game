import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PlayButton({ onPress }: { onPress: () => void }) {
  const width = useSharedValue(100);

  return (
    <Pressable onPress={onPress} style={[styles.container]}>
      <Text style={styles.playText}>Play</Text>
    </Pressable>
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
