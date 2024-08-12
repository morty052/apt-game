import { Colors } from 'constants/colors';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'components/ui/Text';
import { useSinglePlayerStore } from 'models/singlePlayerStore';

const selectLetter = (alphabets: string[]) => {
  const hardLetters = ['X', 'Y', 'Z'];
  const letterPool = alphabets.filter((letter) => !hardLetters.includes(letter));
  const letter = alphabets[Math.floor(Math.random() * letterPool.length)];
  return letter;
};

export default function SinglePlayerLetterSelect() {
  const [thinking, setThinking] = useState(true);
  const [seconds, setSeconds] = useState(3);
  const { alphabets, playing, tallying, confirmLetterSelection, activeLetter } =
    useSinglePlayerStore();

  useEffect(() => {
    if (playing || tallying) {
      return;
    }
    const letter = selectLetter(alphabets);
    const selectLetterTimeout = setTimeout(() => {
      console.log('letter', letter);
      useSinglePlayerStore.setState({ activeLetter: letter });
      setThinking(false);
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
          <Text style={styles.activeLetter}>{activeLetter}</Text>
          <Text style={{ fontSize: 20 }}>Round starts in {seconds}</Text>
        </View>
      )}
      {thinking && <Text>thinking...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeLetter: {
    color: 'black',
    fontSize: 50,
  },
});
