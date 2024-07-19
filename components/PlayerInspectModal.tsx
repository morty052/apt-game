import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps, SocketProps } from 'types';
import { Button } from './ui/Button';
import Wizard from './rive/Wizard';
import { useGameStore } from 'models/gameStore';

type VerdictProps = { isReal: boolean; description: string };

const PlayerAnswerBar = ({
  title,
  value,
  onPress,
}: {
  title: string;
  value: string | undefined;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
      }}>
      <Text style={{ color: 'white' }}>{title}</Text>
      <Text style={{ color: 'white' }}>{value}</Text>
    </Pressable>
  );
};

const VerdictView = ({
  verdict,
  handleClose,
}: {
  verdict: VerdictProps;
  handleClose: () => void;
}) => {
  const { description, isReal } = verdict ?? {};
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        gap: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        marginTop: 40,
        paddingBottom: 30,
        justifyContent: 'space-between',
      }}>
      <View style={{ gap: 20 }}>
        <Text>{isReal ? 'Real' : 'Fake'}</Text>
        <Text style={{ fontSize: 20 }}>{description}</Text>
      </View>
      <Button onPress={handleClose} title="Accept" />
    </View>
  );
};

// const useInspection = () => {

// }

const PlayerInspectModal = ({
  player,
  open,
  handleClose,
  socket,
  room,
}: {
  player: playerProps;
  open: boolean;
  handleClose: () => void;
  room: string;
  socket: SocketProps | null;
}) => {
  const [verifyingAnswer, setVerifyingAnswer] = React.useState(false);
  const [verdict, setVerdict] = React.useState<null | VerdictProps>(null);

  const { handleBonusPoints, player: accuser } = useGameStore();

  const { character } = accuser;

  const { answers, username } = player ?? {};
  const { Animal, Name, Place, Thing } = answers ?? {};

  const handleInspect = React.useCallback(
    ({ query, type }: { query: string | undefined; type: string }) => {
      setVerifyingAnswer(true);
      socket?.emit(
        'VERIFY_ANSWER',
        { room, username, query, type },
        (data: { verdict: VerdictProps }) => {
          const { isReal, description } = data.verdict;
          console.log('isReal', isReal);

          if (isReal) {
            console.log('real stuff', isReal, description);
            setVerifyingAnswer(false);
            setVerdict(data.verdict);
            return;
          }

          // * handle detective character
          if (character === 'DETECTIVE') {
            handleBonusPoints(character);
          }

          console.log('Fake stuff', character);
          setVerifyingAnswer(false);
          socket?.emit('BUST_PLAYER', { username, room, answer: query, type });
        }
      );
    },
    [socket, room, setVerifyingAnswer, username]
  );

  const handleCloseVerdict = React.useCallback(() => {
    setVerdict(null);
  }, []);

  return (
    <Modal animationType="fade" statusBarTranslucent visible={open}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <Text>{username}</Text>
        {!verdict && (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              gap: 30,
              backgroundColor: '#00c4ee',
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

            {!verifyingAnswer && (
              <View style={{ gap: 30 }}>
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Name, type: 'Name' })}
                  title="Name"
                  value={Name}
                />
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Animal, type: 'Animal' })}
                  title="Animal"
                  value={Animal}
                />
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Place, type: 'Place' })}
                  title="Place"
                  value={Place}
                />
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Thing, type: 'Thing' })}
                  title="Thing"
                  value={Thing}
                />
              </View>
            )}
            {verifyingAnswer && <Wizard />}
          </View>
        )}

        {verdict && <VerdictView handleClose={handleCloseVerdict} verdict={verdict} />}
      </SafeAreaView>
    </Modal>
  );
};

export default PlayerInspectModal;
