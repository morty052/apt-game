import { useGameStore } from 'models/gameStore';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps, SocketProps } from 'types';
import { getItem } from 'utils/storage';

import HUD from './Hud';
import PlayerInspectModal from './PlayerInspectModal';
import { Button } from './ui/Button';
import { useTallyTime } from './Timer';

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

const TallyScreen = ({ socket, room }: { socket: SocketProps | null; room: string }) => {
  const [playerToInspect, setPlayerToInspect] = React.useState<playerProps | null>();
  const [inspectionModalOpen, setInspectionModalOpen] = React.useState(false);

  const { player, opponents, handleBustedPlayer } = useGameStore();

  const { seconds, setPaused } = useTallyTime();

  function handlePlayerInspect(player: any) {
    setPlayerToInspect(player);
    setInspectionModalOpen(true);
  }

  function handleCloseInspectionModal() {
    setInspectionModalOpen(false);
    setPlayerToInspect(null);
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

    socket?.on('START_EXIT_TALLY_COUNTDOWN', (data) => {
      console.log(data);
      setPaused(false);
    });

    socket?.on('WAITING_VERDICT', (data) => {
      console.log(data);
      setPaused(true);
    });

    socket?.on('VERDICT_RECEIVED', (data) => {
      console.log(data);
      setPaused(false);
    });

    return () => {
      socket?.off('PLAYER_BUSTED');
      // socket?.off('START_COUNTDOWN');
      socket?.off('START_EXIT_TALLY_COUNTDOWN');
      socket?.off('WAITING_VERDICT');
      socket?.off('VERDICT_RECEIVED');
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
          <HUD seconds={seconds} />
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
