import { Ionicons } from '@expo/vector-icons';
import { checkEnergy } from 'api/index';
import { Button } from 'components/ui/Button';
import { ModalComponent } from 'components/ui/ModalComponent';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import SocketContext from 'contexts/SocketContext';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import PendingMatchScreen from 'screens/pending-match-screen/PendingMatchScreen';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

import energyBar from '../../assets/icons/thunderbolt-icon--min.png';
import AdComponent, { BannerAdComponent } from 'components/AdComponent';
import { PlayerAvatar } from 'components/Avatar';

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
  return <Pressable onPress={handleSelect}>{children}</Pressable>;
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

const LowEnergyModal = ({
  visible,
  onClose,
  onWatchAds,
}: {
  visible: boolean;
  onClose: () => void;
  onWatchAds: () => void;
}) => {
  return (
    <ModalComponent transparent style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} visible={visible}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View
          style={{
            flex: 0.7,
            backgroundColor: Colors.plain,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 30,
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Image source={energyBar} style={{ width: 100, height: 100 }} />
          <Text>Out of Energy</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            You need at least one energy bar to play
          </Text>
          <Button
            fontSize={18}
            style={{ width: 200, height: 40, paddingVertical: 0 }}
            title="Refuel"
          />
          <Pressable onPress={onWatchAds}>
            <Text style={{ textAlign: 'center', fontSize: 12 }}>Watch videos to refuel</Text>
          </Pressable>
          <Pressable
            style={{
              position: 'absolute',
              top: -50,
              right: 10,
              backgroundColor: 'white',
              borderRadius: 100,
              padding: 10,
            }}
            onPress={onClose}>
            <Ionicons name="close" size={24} color="red" />
          </Pressable>
        </View>
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
  const [viewingAds, setViewingAds] = useState(false);

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
      console.log('loading', loading);
      return;
    }

    navigation.navigate('SinglePlayerGameScreen');
  }, [navigation, loading]);

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
  }, [setLoading]);

  useEffect(() => {
    socket?.on('MATCH_FOUND', (data: { queue: playerProps[]; room: string }) => {
      handleMatchFound(data.queue, data.room);
    });
  }, [socket]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.plain }}>
      <BannerAdComponent />
      <View style={styles.container}>
        <LimitedTimeMode />
        <ModeSelectBox handleSelect={() => handleStartSinglePlayer()}>
          <View
            style={{
              gap: 10,
              backgroundColor: '#00c4ee',
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text style={{ textAlign: 'center', color: 'white' }}>Single Player Mode</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', height: 60 }}>
              <PlayerAvatar />
              <Text>Vs</Text>
              <PlayerAvatar />
            </View>
            <Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>
              Play alone against the wizard of words in a quick game of 6 rounds
            </Text>
            <Button style={{ width: 200, selfAlign: 'center' }} title="Play" />
          </View>
        </ModeSelectBox>
        <ModeSelectBox handleSelect={() => handleFindMatch('HEAD_TO_HEAD')}>
          <Text>Head to Head</Text>
        </ModeSelectBox>
      </View>
      {matchmaking && <PendingMatchScreen />}
      <LowEnergyModal
        onWatchAds={() => setViewingAds(true)}
        onClose={() => {
          setEnergyLow(false);
          navigation.goBack();
        }}
        visible={energyLow}
      />
      <AdComponent visible={viewingAds} setVisible={setViewingAds} />
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
