import { checkEnergy } from 'api/index';
import { ModalComponent } from 'components/ui/ModalComponent';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import SocketContext from 'contexts/SocketContext';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import PendingMatchScreen from 'screens/pending-match-screen/PendingMatchScreen';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

type gameModeProps = {
  value: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH';
  title: string;
};

function ModeSelectBox({
  handleSelect,
  children,
}: {
  handleSelect: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      onPress={handleSelect}
      style={{
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 40,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
      }}>
      {children}
    </Pressable>
  );
}
function LimitedTimeMode() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 10,
        height: 150,
        backgroundColor: 'white',
      }}>
      <Text>Limited Time Mode</Text>
    </View>
  );
}

export const ModeSelectWindow = ({
  selectingMode,
  setSelectingMode,
}: {
  selectingMode: boolean;
  setSelectingMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={{ height: 40, width: 40, backgroundColor: 'red' }}
        onPress={() => setSelectingMode(false)}
      />
      <LimitedTimeMode />
      {/* <ModeSelectBox title="Head to Head" />
      <ModeSelectBox title="Full House" />
      <ModeSelectBox title="Private Match" />
      <ModeSelectBox title="Survival Match" /> */}
    </View>
  );
};

const MatchLoadingModal = ({ visible }: { visible: boolean }) => {
  return (
    <ModalComponent visible={visible}>
      <View>
        <Text>Checking Energy</Text>
      </View>
    </ModalComponent>
  );
};

const LowEnergyModal = ({ visible }: { visible: boolean }) => {
  return (
    <ModalComponent visible={visible}>
      <View>
        <Text>Checking Energy</Text>
      </View>
    </ModalComponent>
  );
};

export const ModeScreen = ({ navigation }: any) => {
  const { socket } = useContext(SocketContext);
  const { initGame } = useGameStore();
  const { character, matchmaking } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [energyLow, setEnergyLow] = useState(false);

  const handleFindMatch = useCallback(
    (mode: gameModeProps['value']) => {
      if (matchmaking) {
        return;
      }
      const username = getItem('USERNAME') as string;
      useAppStore.setState(() => ({ matchmaking: true }));
      socket?.emit(
        'FIND_MATCH',
        {
          lobbyType: mode,
          player: {
            username,
            character: character.name,
          },
        },
        (data: { matchId?: string }) => {
          console.log('joined queue');
        }
      );
      console.log(mode);
    },
    [character, socket, matchmaking, useAppStore, getItem]
  );

  function handleMatchFound(queue: playerProps[], room: string) {
    //* save current player room and opponents to state
    initGame({ queue, room });

    //* open match found modal clear matchmaking state
    useAppStore.setState(() => ({ matchmaking: false, matchFound: true }));
    // navigation.navigate('GameScreen', { room });
  }

  const handleStartSinglePlayer = useCallback(async () => {
    if (loading) {
      return;
    }

    navigation.navigate('SinglePlayerGameScreen');
  }, [navigation]);

  useEffect(() => {
    checkEnergy().then((canPlay) => {
      console.log({ canPlay });
      if (canPlay) {
        setLoading(false);
      } else {
        setEnergyLow(true);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    socket?.on('MATCH_FOUND', (data: { queue: playerProps[]; room: string }) => {
      handleMatchFound(data.queue, data.room);
    });
  }, [socket]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.plain }}>
      <View style={styles.container}>
        <LimitedTimeMode />
        <ModeSelectBox handleSelect={() => handleStartSinglePlayer()}>
          <Text>Single Player</Text>
        </ModeSelectBox>
        <ModeSelectBox handleSelect={() => handleFindMatch('HEAD_TO_HEAD')}>
          <Text>Head to Head</Text>
        </ModeSelectBox>
      </View>
      {matchmaking && <PendingMatchScreen />}
      <LowEnergyModal visible={energyLow} />
    </View>
  );
};

export default ModeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.plain,
    gap: 20,
    paddingTop: 20,
  },
});
