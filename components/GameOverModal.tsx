import { useGameStore } from 'models/gameStore';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from './ui/Button';
import { Text } from './ui/Text';
import { ArcSlider } from './ArcSlider';

function WinOrLoseView({ totalScore, onContinue }: { totalScore: number; onContinue: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>You Win</Text>
      <View style={{ gap: 20, flex: 1 }}>
        <Image
          style={{ height: 300, width: 300, alignSelf: 'center' }}
          source={{
            uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721898799/wimoptoz8qwzcp5s40tf.png',
          }}
        />
        <View style={{ gap: 10 }}>
          <Text style={{ textAlign: 'center' }}>You Scored</Text>
          <Text style={{ textAlign: 'center', fontSize: 40 }}>{totalScore} Points</Text>
        </View>
      </View>
      <Button title="Continue" onPress={onContinue} />
    </View>
  );
}

function PerformanceView({ totalScore }: { totalScore: number }) {
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>You Win</Text>
      <View style={{ gap: 20, flex: 1, paddingTop: 20 }}>
        <ArcSlider />
        <View style={{ paddingTop: 260, flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>Average</Text>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>You earned average this game</Text>
        </View>
      </View>
      <Button title="Continue" onPress={() => {}} />
    </View>
  );
}

export default function GameOverModal() {
  const [viewingPerformance, setViewingPerformance] = useState(false);
  const { totalScore } = useGameStore();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'pink' }}>
        {viewingPerformance ? (
          <PerformanceView totalScore={totalScore} />
        ) : (
          <WinOrLoseView onContinue={() => setViewingPerformance(true)} totalScore={totalScore} />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
});
