import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HappyFace from '../../../assets/icons/happy-face-min.png';
import SadFace from '../../../assets/icons/hurt-face-min.png';
import SuprisedFace from '../../../assets/icons/surprised-min.png';

const faces = {
  happy: HappyFace,
  sad: SadFace,
  surprised: SuprisedFace,
};

const LivesIndicator = () => {
  const { lives } = useSinglePlayerStore();
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: 'white',
          height: 80,
          width: 80,
          borderRadius: 10,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="heart" size={70} color="red" />
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 3,
          }}>
          <Text style={{ color: 'white', fontSize: 24 }}>{lives + 1}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Ionicons name="chevron-forward" size={30} color="red" />
        <Ionicons name="chevron-forward" size={30} color="red" />
        <Ionicons name="chevron-forward" size={30} color="red" />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          height: 80,
          width: 80,
          borderRadius: 10,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="heart" size={70} color="red" />
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 3,
          }}>
          <Text style={{ color: 'white', fontSize: 24 }}>{lives}</Text>
        </View>
      </View>
    </View>
  );
};

const useScoreModal = () => {
  const [scoreForRound, setScoreForRound] = useState(0);
  const { player, round, readyNextRound, getPointsForPlayer, viewingResults, takenDamage } =
    useSinglePlayerStore();
  const { playSound } = useSoundTrackModel();

  const expression = useMemo(() => {
    if (scoreForRound <= 50) {
      return 'sad';
    }

    if (scoreForRound <= 150) {
      return 'happy';
    }

    if (scoreForRound >= 175) {
      return 'surprised';
    }

    return 'happy';
  }, [scoreForRound]);

  const remark = useMemo(() => {
    if (scoreForRound <= 50) {
      return 'Aw shucks!';
    }

    if (scoreForRound <= 150) {
      return 'Good job!';
    }

    if (scoreForRound >= 175) {
      return 'Stupendous!';
    }

    return 'Aw shucks!';
  }, [scoreForRound]);

  const handLeFinishRound = useCallback(() => {
    const nextRound = round + 1;
    console.log({ nextRound });
    if (nextRound >= 7) {
      useSinglePlayerStore.setState({ gameOver: true });
      return;
    }
    readyNextRound(nextRound);
    useSinglePlayerStore.setState({ viewingResults: false, takenDamage: false });
  }, [readyNextRound]);

  const hintToShow = useMemo(() => {
    const hintIndex = Math.floor(Math.random() * 2);
    const hints = ['Skipping answers costs one heart', 'Incorrect answers costs one heart'];
    return hints[hintIndex];
  }, []);

  useEffect(() => {
    if (!viewingResults) return;

    const totalPoints = getPointsForPlayer({ player });
    setScoreForRound(totalPoints);
    playSound('SCORE_FOR_ROUND_SOUND');
  }, [viewingResults]);

  return {
    scoreForRound,
    handLeFinishRound,
    expression,
    remark,
    takenDamage,
    hintToShow,
  };
};

const SinglePlayerScoreForRoundModal = ({ open }: { open: boolean }) => {
  const { scoreForRound, remark, expression, handLeFinishRound, takenDamage, hintToShow } =
    useScoreModal();

  return (
    <Modal animationType="fade" statusBarTranslucent visible={open}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View
          onLayout={() => {}}
          style={{
            flex: 1,
            paddingHorizontal: 10,
            gap: 30,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 10,
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 50,
              gap: 20,
            }}>
            {!takenDamage && (
              <>
                <Text style={{ fontSize: 25 }}>{remark}</Text>
                <Image
                  source={faces[expression as keyof typeof faces]}
                  style={{ width: 200, height: 200 }}
                />
              </>
            )}
            {takenDamage && (
              <>
                <LivesIndicator />
                <Image source={SadFace} style={{ width: 200, height: 200 }} />
              </>
            )}
            <View style={{ gap: 4, alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}>You scored</Text>
              <Text style={{ fontSize: 35, fontWeight: '700' }}>{scoreForRound}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <Button title="Continue" onPress={handLeFinishRound} />
            </View>
            {takenDamage && (
              <Text style={{ textAlign: 'center', fontSize: 14 }}>Hint: {hintToShow}</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SinglePlayerScoreForRoundModal;
