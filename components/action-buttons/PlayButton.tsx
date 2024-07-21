import { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable);

export default function PlayButton({ onPress }: { onPress: () => void }) {
  const buttonScale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      buttonScale.value = 0.8;
    })
    .onEnd(() => {
      buttonScale.value = 1;
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      // opacity: pressedIn ? 0.5 : 1,
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedTouchableOpacity onPress={onPress} style={[styles.container, animatedStyles]}>
        <Text style={styles.playText}>Play</Text>
      </AnimatedTouchableOpacity>
    </GestureDetector>
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
