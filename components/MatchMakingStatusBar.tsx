import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

export default function MatchMakingStatusBar() {
  const color = useSharedValue('white');

  const animatedStyles = useAnimatedStyle(() => {
    return {
      color: color.value,
    };
  });

  useEffect(() => {
    color.value = withRepeat(withTiming('gold', { duration: 800, easing }), -1);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.innerContainer]}>
        <Animated.Text style={[animatedStyles, { fontFamily: 'Crispy-Tofu', fontSize: 20 }]}>
          Finding Match
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  innerContainer: {
    maxWidth: 400,
    height: 70,
    backgroundColor: '#00c4ee',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
});
