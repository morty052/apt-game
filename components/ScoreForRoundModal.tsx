import { Ionicons } from '@expo/vector-icons';
import { getPointsForPlayer, useGameStore } from 'models/gameStore';
import { useEffect, useState } from 'react';
import { Modal, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocketProps } from 'types';
import { getItem } from 'utils/storage';

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

  useEffect(() => {
    if (!open) return;
    const totalPoints = getPointsForPlayer({ player, opponents });
    setScoreForRound(totalPoints);
    socket?.emit('UPDATE_SCORES', {
      player: { username: getItem('USERNAME') },
      scoreForRound: totalPoints,
      room,
    });
  }, [open]);

  return (
    <Modal animationType="fade" statusBarTranslucent visible={open}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View
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
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>You scored</Text>
            <Text style={{ fontSize: 30, fontWeight: '700' }}>{scoreForRound}</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ScoreForRoundModal;
