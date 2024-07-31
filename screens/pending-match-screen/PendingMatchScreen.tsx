import { ModalComponent } from 'components/ui/ModalComponent';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useAppStore } from 'models/appStore';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import compass from '../../assets/icons/findingmatchicon.png';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function PendingMatchScreen() {
  const y = useSharedValue(0);
  const opacity = useSharedValue(1);
  const matchmaking = useAppStore((state) => state.matchmaking);

  useEffect(() => {
    y.value = withRepeat(withTiming(10, { duration: 1000 }), -1, true);
    opacity.value = withRepeat(withTiming(0.8, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }, { rotate: '-20deg' }],
    };
  });

  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <ModalComponent style={{ backgroundColor: Colors.tertiary }} visible={matchmaking}>
      <View style={styles.container}>
        <View>
          <AnimatedImage
            source={compass}
            style={[{ height: 300, width: 300, alignSelf: 'center' }, animatedStyles]}
          />
          <Animated.Text
            style={[
              { textAlign: 'center', fontSize: 30, color: 'white', fontFamily: 'Crispy-Tofu' },
              animatedTextStyles,
            ]}>
            Finding Match
          </Animated.Text>
        </View>
        <View style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.5)', width: '100%' }} />
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 24,
          }}>
          Elephant
        </Text>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
          The largest land animal and mammal. native to Africa and Asia, usually travels in groups.
        </Text>
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    position: 'relative',
    paddingTop: 20,
    gap: 30,
  },
});
