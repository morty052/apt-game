import { Canvas, Circle, Path, Rect, Skia } from '@shopify/react-native-skia';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { polar2Canvas } from 'react-native-redash';

const { width, height } = Dimensions.get('window');

const ghost = require('../assets/mickey.png');

export const ArcSlider = () => {
  return <View style={{ backgroundColor: 'red', borderRadius: 10 }}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 250,
  },
  cursor: {
    backgroundColor: 'green',
  },
  ghost: {
    flex: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
