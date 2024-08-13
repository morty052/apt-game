import { Ionicons } from '@expo/vector-icons';
import { Button } from 'components/ui/Button';
import { useSinglePlayerStore } from 'models/singlePlayerStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'components/ui/Text';

import HappyFace from '../../../assets/icons/happy-face-min.png';
import SadFace from '../../../assets/icons/hurt-face-min.png';
import SuprisedFace from '../../../assets/icons/surprised-min.png';

const faces = {
  happy: HappyFace,
  sad: SadFace,
  surprised: SuprisedFace,
};

const SinglePlayerScoreForRoundModal = ({ open }: { open: boolean }) => {
  const [scoreForRound, setScoreForRound] = useState(0);
  const { player, round, readyNextRound, getPointsForPlayer, viewingResults } =
    useSinglePlayerStore();
  const { playSound } = useSoundTrackModel();

  useEffect(() => {
    if (!viewingResults) return;

    const totalPoints = getPointsForPlayer({ player });
    setScoreForRound(totalPoints);
  }, [viewingResults]);

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
    useSinglePlayerStore.setState({ viewingResults: false });
  }, [readyNextRound]);

  return (
    <Modal animationType="fade" statusBarTranslucent visible={open}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View
          onLayout={() => playSound('SCORE_FOR_ROUND_SOUND')}
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
            <Text style={{ fontSize: 25 }}>{remark}</Text>
            <Image source={faces[expression]} style={{ width: 200, height: 200 }} />
            <View style={{ gap: 4, alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}>You scored</Text>
              <Text style={{ fontSize: 35, fontWeight: '700' }}>{scoreForRound}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <Button title="Continue" onPress={handLeFinishRound} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SinglePlayerScoreForRoundModal;
