import { Colors } from 'constants/colors';
import { useGameStore } from 'models/gameStore';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getItem } from 'utils/storage';
import { updatePlayerHighScore } from 'utils/supabase';

import { Button } from './ui/Button';
import { Text } from './ui/Text';

const AnimatedImage = Animated.createAnimatedComponent(Image);

type matchStatsProps = {
  totalScore: number;
  new_highscore: boolean | undefined;
  new_total_score: number;
};

function WinnersCrown() {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withRepeat(withTiming(10, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }, { rotate: '-20deg' }],
    };
  });

  return (
    <AnimatedImage
      style={[{ height: 300, width: 300, alignSelf: 'center' }, animatedStyles]}
      source={{
        uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721898799/wimoptoz8qwzcp5s40tf.png',
      }}
    />
  );
}

const LoadingButton = () => {
  return (
    <Pressable style={styles.loadingButton}>
      <ActivityIndicator />
    </Pressable>
  );
};

function WinOrLoseView({
  totalScore,
  onContinue,
  isWinner,
  gettingStats,
}: {
  totalScore: number;
  onContinue: () => void;
  isWinner: boolean;
  gettingStats: boolean;
}) {
  return (
    <View style={[styles.container]}>
      <Text style={{ textAlign: 'center', color: 'white', fontSize: 30 }}>
        {isWinner ? 'You Win!' : 'Better luck next time'}
      </Text>
      <View style={{ gap: 20, flex: 1 }}>
        <WinnersCrown />
        <View style={{ gap: 10 }}>
          <Text style={{ textAlign: 'center', color: 'white' }}>You Scored</Text>
          <Text style={{ textAlign: 'center', fontSize: 40, color: 'white' }}>
            {totalScore} Points
          </Text>
        </View>
      </View>
      {!gettingStats ? <Button title="Continue" onPress={onContinue} /> : <LoadingButton />}
    </View>
  );
}

function PerformanceView({ matchStats }: { matchStats: matchStatsProps | null }) {
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>You Win</Text>
      <View style={{ gap: 20, flex: 1, paddingTop: 20 }}>
        <Text>{matchStats?.totalScore}</Text>
        <View style={{ paddingTop: 260, flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>Average</Text>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>You earned average this game</Text>
        </View>
      </View>
      <Button title="Continue" onPress={async () => {}} />
    </View>
  );
}

export default function GameOverModal() {
  const [gettingStats, setGettingStats] = useState(false);
  const [viewingPerformance, setViewingPerformance] = useState(false);
  const [matchStats, setMatchStats] = useState<matchStatsProps | null>(null);
  const { totalScore, winner } = useGameStore();

  const isWinner = useMemo(() => winner?.username === getItem('USERNAME'), []);

  const handleShowPerformance = async () => {
    try {
      setGettingStats(true);
      const { updateError, new_highscore, new_total_score } = await updatePlayerHighScore({
        scoreForMatch: totalScore,
        username: getItem('USERNAME') as string,
      });
      console.log({ updateError, new_highscore, new_total_score });
      if (updateError) {
        throw updateError;
      }
      setMatchStats({ new_highscore, new_total_score, totalScore });
      setViewingPerformance(true);
    } catch (error) {
      console.error({ error });
      setGettingStats(false);
    } finally {
      setGettingStats(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.tertiary }}>
        {viewingPerformance ? (
          <PerformanceView matchStats={matchStats} />
        ) : (
          <WinOrLoseView
            gettingStats={gettingStats}
            isWinner={isWinner}
            onContinue={() => handleShowPerformance()}
            totalScore={totalScore}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  loadingButton: {
    alignItems: 'center',
    backgroundColor: Colors.ButtonOutline,
    borderRadius: 24,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 8,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: 'gold',
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Crispy-Tofu',
    textAlign: 'center',
  },
});
