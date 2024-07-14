import { Ionicons } from '@expo/vector-icons';
import { getPointsForPlayer, useGameStore } from 'models/gameStore';
import { useEffect, useState } from 'react';
import { Modal, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScoreForRoundModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [scoreForRound, setScoreForRound] = useState(0);
  const { player, opponents } = useGameStore();

  useEffect(() => {
    if (!open) return;
    const totalPoints = getPointsForPlayer({ player, opponents });
    setScoreForRound(totalPoints);
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
