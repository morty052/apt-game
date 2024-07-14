import { Button } from 'components/ui/Button';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

function Box() {
  const display = useSharedValue<'none' | 'flex'>('none');
  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    display: display.value,
    transform: [{ scale: scale.value }],
  }));
  function handleShow() {
    if (display.value === 'flex') {
      scale.value = withTiming(0);
      display.value = 'none';

      return;
    }

    display.value = 'flex';
    scale.value = withTiming(1);
  }

  return (
    <>
      <Animated.View
        exiting={FadeOutRight}
        style={[
          {
            backgroundColor: 'white',
            borderRadius: 20,
            position: 'absolute',
            right: 20,
            bottom: 50,
            zIndex: 2,
            width: '70%',
            height: 300,
          },
          animatedStyle,
        ]}
      />
      <Button onPress={handleShow} />
    </>
  );
}

export const Home = () => {
  const width = Dimensions.get('window').width;
  console.log(width);
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
    paddingTop: 10,
  },
});
