import { useNavigation } from '@react-navigation/native';
import ALPHABETS from 'constants/alphabets';
import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
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

import PerformanceMeter, { performanceAnimationNames } from './rive/PerformanceMeter';
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

export function PerformanceView({
  matchStats,
  onPressContinue,
}: {
  matchStats: matchStatsProps | null;
  onPressContinue: () => void;
}) {
  const performance = useMemo(() => {
    let animation: performanceAnimationNames = 'zero';
    const totalScore = matchStats?.totalScore || 0;

    if (totalScore < 200) {
      animation = 'zero';
      return animation;
    }

    if (totalScore > 200 && totalScore < 400) {
      animation = 'okay';
      return animation;
    }

    if (totalScore > 400 && totalScore < 600) {
      animation = 'average';
      return animation;
    }

    if (totalScore > 600 && totalScore < 800) {
      animation = 'good';
      return animation;
    }

    if (totalScore > 800) {
      animation = 'great';
      return animation;
    }

    return animation;
  }, [matchStats?.totalScore]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.tertiary }]}>
      <View
        style={{
          flex: 1,
          paddingTop: 20,
          alignItems: 'center',
          gap: 20,
          // backgroundColor: 'pink',
        }}>
        <View>
          <Text style={{ textAlign: 'center', color: 'white' }}>You Scored</Text>
          <Text style={{ textAlign: 'center', fontSize: 30, color: 'white' }}>
            {matchStats?.totalScore} Points
          </Text>
        </View>
        <PerformanceMeter animation={performance || 'zero'} />
        <View style={{ paddingTop: 20, flex: 1 }}>
          <Text style={{ textAlign: 'center', fontSize: 20, color: 'white' }}>
            You performed {performance !== 'zero' ? performance : 'poorly'} this game
          </Text>
        </View>
      </View>
      <Button title="Continue" onPress={onPressContinue} />
    </SafeAreaView>
  );
}

export default function GameOverModal() {
  const [gettingStats, setGettingStats] = useState(false);
  const [viewingPerformance, setViewingPerformance] = useState(false);
  const [matchStats, setMatchStats] = useState<matchStatsProps | null>(null);
  const { totalScore, winner } = useGameStore();

  const isWinner = useMemo(() => winner?.username === getItem('USERNAME'), [winner]);

  const { playSound } = useSoundTrackModel();

  const navigation = useNavigation<any>();

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

  const resetGame = () => {
    useGameStore.setState(() => ({
      room: '',
      player: {
        username: getItem('USERNAME') || 'Guest',
        answers: { Name: '', Animal: '', Place: '', Thing: '' },
        score: 0,
        inTallyMode: false,
        turn: 0,
        strikes: 0,
        doneTallying: false,
        character: null,
      },
      opponents: [],
      winner: null,
      round: 0,
      activeLetter: 'A',
      totalScore: 0,
      alphabets: ALPHABETS,
      selectingLetter: true,
      playing: false,
      tallying: false,
      currentTurn: 0,
    }));
    navigation.navigate('HomeScreen');
  };

  const handleMatchFinish = () => {
    if (!matchStats) {
      return;
    }
    const highScore = useAppStore.getState().stats.high_score;
    const isHighScore = matchStats.totalScore > highScore;

    useAppStore.setState((state) => ({
      stats: {
        ...state.stats,
        points: matchStats.totalScore + state.stats.points,
        games_played: state.stats.games_played + 1,
        high_score: isHighScore ? matchStats.totalScore : highScore,
        wins: isWinner ? state.stats.wins + 1 : state.stats.wins,
        losses: isWinner ? state.stats.losses : state.stats.losses + 1,
      },
    }));
    resetGame();
  };

  useEffect(() => {
    if (!winner) return;
    else if (winner) {
      playSound(winner.username === getItem('USERNAME') ? 'WINNER_SOUND' : 'LOSER_SOUND');
    }
  }, [winner]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.tertiary }}>
        <LinearGradient colors={[Colors.tertiary, Colors.primary]} style={{ flex: 1 }}>
          {viewingPerformance ? (
            <PerformanceView onPressContinue={handleMatchFinish} matchStats={matchStats} />
          ) : (
            <WinOrLoseView
              gettingStats={gettingStats}
              isWinner={isWinner}
              onContinue={() => handleShowPerformance()}
              totalScore={totalScore}
            />
          )}
        </LinearGradient>
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
