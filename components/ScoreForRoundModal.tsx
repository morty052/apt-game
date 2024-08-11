import { Ionicons } from '@expo/vector-icons';
import { getPointsForPlayer, useGameStore } from 'models/gameStore';
import { useSoundTrackModel } from 'models/soundtrackModel';
import { useEffect, useMemo, useState } from 'react';
import { Image, Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocketProps } from 'types';
import { getItem } from 'utils/storage';
import { Text } from './ui/Text';
import HappyFace from '../assets/icons/happy-face-min.png';
import SadFace from '../assets/icons/hurt-face-min.png';
import SuprisedFace from '../assets/icons/surprised-min.png';

const faces = {
  happy: HappyFace,
  sad: SadFace,
  surprised: SuprisedFace,
};

const ScoreForRoundModal = ({
  open,
  handleClose,
  socket,
  room,
}: {
  open: boolean;
  handleClose: () => void;
  socket: SocketProps | null;
  room: string;
}) => {
  const [scoreForRound, setScoreForRound] = useState(0);
  const { player, opponents } = useGameStore();
  const { playSound } = useSoundTrackModel();

  useEffect(() => {
    if (!open) return;

    const totalPoints = getPointsForPlayer({ player, opponents });
    setScoreForRound(totalPoints);

    // * SEND SCORES TO SERVER
    socket?.emit('UPDATE_SCORES', {
      player: { username: getItem('USERNAME') },
      scoreForRound: totalPoints,
      room,
    });
  }, [open]);

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
            marginTop: 40,
          }}>
          <Ionicons
            name="close"
            size={24}
            onPress={handleClose}
            style={{ alignSelf: 'flex-end' }}
            color="red"
          />
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
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ScoreForRoundModal;
