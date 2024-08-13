import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  BounceInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const selectLetter = (alphabets: string[]) => {
  const hardLetters = ['X', 'Y', 'Z'];
  const letterPool = alphabets.filter((letter) => !hardLetters.includes(letter));
  const letter = alphabets[Math.floor(Math.random() * letterPool.length)];
  return letter;
};

function ThinkingBubble() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(0.95, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedImage
      style={[{ height: 300, width: 300, alignSelf: 'center' }, animatedStyles]}
      source={{
        uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1723542674/m09sqv4dnya63rpgaexq.png',
      }}
    />
  );
}

export default function SinglePlayerLetterSelect() {
  const [thinking, setThinking] = useState(true);
  const [seconds, setSeconds] = useState(3);
  const { alphabets, playing, tallying, confirmLetterSelection, activeLetter } =
    useSinglePlayerStore();

  const { playSound } = useSoundTrackModel();

  useEffect(() => {
    if (playing || tallying) {
      return;
    }
    const letter = selectLetter(alphabets);
    const selectLetterTimeout = setTimeout(() => {
      console.log('letter', letter);
      useSinglePlayerStore.setState({ activeLetter: letter });
      setThinking(false);
      playSound('SCORE_FOR_ROUND_SOUND');
    }, 3000);
    return () => clearTimeout(selectLetterTimeout);
  }, [playing, tallying]);

  useEffect(() => {
    if (thinking) {
      return;
    }

    if (seconds === 0) {
      confirmLetterSelection(activeLetter);
      setThinking(true);
      setSeconds(3);
      return;
    }

    const interval = setInterval(() => {
      if (seconds === 0) {
        return;
      }
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [thinking, seconds]);

  return (
    <View style={styles.container}>
      {!thinking && (
        <View style={styles.container}>
          <Animated.View
            entering={BounceInUp}
            style={{
              backgroundColor: 'white',
              height: 150,
              width: 150,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              // transform: [{ rotate: '-10deg' }],
            }}>
            <Text style={styles.activeLetter}>{activeLetter}</Text>
          </Animated.View>
          <Text style={{ fontSize: 20, color: 'white' }}>Round starts in {seconds}</Text>
        </View>
      )}
      {thinking && (
        <>
          <ThinkingBubble />
          <Text style={{ fontSize: 24, color: 'white' }}>thinking...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  activeLetter: {
    color: 'black',
    fontSize: 80,
  },
});
