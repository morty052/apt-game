import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'constants/colors';
import { useGameStore } from 'models/gameStore';
import React from 'react';
import { Modal, Pressable, View, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps, SocketProps } from 'types';

import Wizard from '../rive/Wizard';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import AnimalIcon from '../../assets/icons/animal-icon.png';
import NameIcon from '../../assets/icons/friends-icon--min.png';
import PlaceIcon from '../../assets/icons/place-icon.png';
import ThingIcon from '../../assets/icons/thing-icon.png';

type VerdictProps = { isReal: boolean; description: string };

const FieldImage = ({ icon }: { icon: ImageSourcePropType }) => {
  return <Image source={icon} style={styles.fieldImage} />;
};

const PlayerAnswerBar = ({
  title,
  value,
  onPress,
  icon,
}: {
  title: string;
  value: string | undefined;
  onPress: () => void;
  icon: any;
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.answerContainer]}>
      <FieldImage icon={icon} />
      <View style={[styles.answer]}>
        <Text style={{ color: 'black' }}>{title}</Text>
        <Text style={{ color: 'black' }}>{value}</Text>
      </View>
    </Pressable>
  );
};

const VerdictView = ({
  verdict,
  handleClose,
  answer,
}: {
  verdict: VerdictProps;
  handleClose: () => void;
  answer: string | undefined;
}) => {
  const { description, isReal } = verdict ?? {};
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: Colors.tertiary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        marginTop: 40,
        paddingBottom: 30,
        justifyContent: 'space-between',
      }}>
      <View style={{ gap: 40 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
          }}>
          <Text>{isReal ? 'Correct' : 'Fake'}</Text>
          <Ionicons name="checkmark-circle" size={30} color={isReal ? 'green' : 'red'} />
        </View>
        <View style={{ gap: 20 }}>
          <Text style={{ textTransform: 'capitalize', fontSize: 24, color: 'white' }}>
            {answer}:
          </Text>
          <Text style={{ fontSize: 16, color: 'white' }}>{description}</Text>
        </View>
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
  const [query, setQuery] = React.useState<string | undefined>('');
  const [verdict, setVerdict] = React.useState<null | VerdictProps>(null);

  const { handleBonusPoints, player: accuser } = useGameStore();

  const { character } = accuser;

  const { answers, username } = player ?? {};
  const { Animal, Name, Place, Thing } = answers ?? {};

  const handleInspect = React.useCallback(
    ({ query, type }: { query: string | undefined; type: string }) => {
      setVerifyingAnswer(true);
      setQuery(query);
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
    [socket, room, setVerifyingAnswer, username, setQuery]
  );

  const handleCloseVerdict = React.useCallback(() => {
    setVerdict(null);
  }, []);

  return (
    <Modal animationType="fade" statusBarTranslucent visible={open}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
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
                <Text style={{ color: 'white' }}> {username}</Text>
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Name, type: 'Name' })}
                  title="Name"
                  value={Name}
                  icon={NameIcon}
                />
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Animal, type: 'Animal' })}
                  title="Animal"
                  value={Animal}
                  icon={AnimalIcon}
                />
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Place, type: 'Place' })}
                  title="Place"
                  value={Place}
                  icon={PlaceIcon}
                />
                <PlayerAnswerBar
                  onPress={() => handleInspect({ query: Thing, type: 'Thing' })}
                  title="Thing"
                  value={Thing}
                  icon={ThingIcon}
                />
              </View>
            )}
            {verifyingAnswer && <Wizard />}
          </View>
        )}

        {verdict && (
          <VerdictView answer={query} handleClose={handleCloseVerdict} verdict={verdict} />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    gap: 10,
    justifyContent: 'center',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  answerContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  answer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 },
  answerText: { fontSize: 14 },
  fieldImage: {
    height: 40,
    width: 40,
  },
});

export default PlayerInspectModal;
