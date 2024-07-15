import { Ionicons } from '@expo/vector-icons';
import { getPointsForPlayer, useGameStore } from 'models/gameStore';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps, SocketProps } from 'types';
import { getItem } from 'utils/storage';

import HUD from './Hud';
import PlayerInspectModal from './PlayerInspectModal';
import { Button } from './ui/Button';

const PlayerCard = ({
  username,
  onPress,
  inTallyMode,
}: {
  username: string;
  onPress: () => void;
  inTallyMode: boolean;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ borderColor: 'white', borderWidth: 1, borderRadius: 10, padding: 10, height: 60 }}>
      <Text>{username}</Text>
    </Pressable>
  );
};

const OpponentCard = ({
  username,
  onPress,
  inTallyMode,
}: {
  username: string;
  onPress: () => void;
  inTallyMode: boolean;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        height: 60,
        backgroundColor: inTallyMode ? 'green' : 'white',
      }}>
      <Text>{username}</Text>
    </Pressable>
  );
};

const FinalTallYModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [scoreForRound, setScoreForRound] = React.useState(0);
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

const TallyScreen = ({ socket, room }: { socket: SocketProps | null; room: string }) => {
  const [playerToInspect, setPlayerToInspect] = React.useState<playerProps | null>();
  const [inspectionModalOpen, setInspectionModalOpen] = React.useState(false);
  const [viewingFinalTally, setViewingFinalTally] = React.useState(false);
  const [scoreForRound, setScoreForRound] = React.useState(0);

  const { player, opponents, readyNextRound, handleBustedPlayer, updateOpponents } = useGameStore();

  function handlePlayerInspect(player: any) {
    setPlayerToInspect(player);
    setInspectionModalOpen(true);
  }

  function handleCloseInspectionModal() {
    setInspectionModalOpen(false);
    setPlayerToInspect(null);
  }

  function handleCloseTallyScreen() {
    readyNextRound();
    setViewingFinalTally(false);
  }

  React.useEffect(() => {
    socket?.on('PLAYER_BUSTED', (data) => {
      const { username, type } = data;

      if (username === getItem('USERNAME')) {
        handleBustedPlayer({ username, type, self: true });
        console.log('You Busted');
        return;
      }
      handleBustedPlayer({ username, type, self: false });
    });

    socket?.on('START_COUNTDOWN', (data) => {
      console.log(data);
    });

    return () => {
      socket?.off('PLAYER_BUSTED');
      socket?.off('START_COUNTDOWN');
      // socket?.off('ALL_PLAYERS_SUBMITTED');
    };
  }, [socket]);

  return (
    <>
      <PlayerInspectModal
        socket={socket}
        room={room}
        handleClose={handleCloseInspectionModal}
        open={inspectionModalOpen}
        player={playerToInspect as playerProps}
      />
      {/* <FinalTallYModal open={viewingFinalTally} handleClose={() => handleCloseTallyScreen()} /> */}
      <SafeAreaView style={styles.alphabetScreencontainer}>
        <View style={{ paddingHorizontal: 10, gap: 20 }}>
          <HUD socket={socket} />
          <PlayerCard
            inTallyMode
            onPress={() => handlePlayerInspect(player)}
            username={player.username}
          />
          <Text>Opponents</Text>
          <View style={{ gap: 10, paddingTop: 10 }}>
            {opponents.map((opponent) => (
              <OpponentCard
                inTallyMode={opponent.inTallyMode}
                onPress={() => handlePlayerInspect({ ...opponent })}
                key={opponent.username}
                username={opponent.username}
              />
            ))}
          </View>
          <Button
            title="Ready"
            onPress={() => {
              socket?.emit('PLAYER_DONE_TALLYING', {
                player,
                room,
              });
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default TallyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingTop: 10,
  },
  gameScreen: {
    flex: 1,
  },
  alphabetScreencontainer: {
    flex: 1,
    backgroundColor: '#00c4ee',
    gap: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  alphabetButton: {
    height: 80,
    width: 80,
    backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  alphabet: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});
