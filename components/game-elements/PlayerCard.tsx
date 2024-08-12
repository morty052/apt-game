import { useGameStore } from 'models/gameStore';
import { ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import AnimalIcon from '../../assets/icons/animal-icon.png';
import NameIcon from '../../assets/icons/friends-icon--min.png';
import PlaceIcon from '../../assets/icons/place-icon.png';
import ThingIcon from '../../assets/icons/thing-icon.png';
import Avatar from '../Avatar';
import { Text } from '../ui/Text';
import { useSinglePlayerStore } from 'models/singlePlayerStore';

const avatarObject = {
  BodyColor: 1,
  BodySize: 1,
  BodyEyes: 2,
  BodyHair: 1,
  BodyFaceHair: 2,
  BackgroundColor: 0,
};

const FieldImage = ({ icon }: { icon: ImageSourcePropType }) => {
  return <Image source={icon} style={styles.fieldImage} />;
};

const FieldDisplay = ({ title, value }: { value: string; title: string }) => {
  return (
    <View style={[styles.answer]}>
      <Text style={styles.answerText}>{title}</Text>
      <Text style={styles.answerText}>{value}</Text>
    </View>
  );
};

const Field = ({ value, children }: { value: string; children: ReactNode }) => {
  const isBusted = value === 'BUSTED';

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(isBusted ? 'red' : 'white'),
    };
  });

  return <Animated.View style={[styles.answerContainer, animatedStyles]}>{children}</Animated.View>;
};

//TODO fix LEAVING FORFEITED HERE OR NOT
export const SinglePlayerCard = ({ username }: { username: string }) => {
  const { totalScore, player } = useSinglePlayerStore();

  const answers = useMemo(() => {
    return Object.values(player.answers);
  }, [player]);

  return (
    <View style={styles.container}>
      <View style={styles.playerInfo}>
        <Avatar avatarObject={avatarObject} />
        <View style={{ paddingLeft: 10, gap: 5 }}>
          <Text>{username}</Text>
          <Text>Points {totalScore}</Text>
        </View>
      </View>
      <View style={{ gap: 20 }}>
        <Field value={answers[0]}>
          <FieldImage icon={NameIcon} />
          <FieldDisplay title="Name" value={answers[0] || 'FORFEITED'} />
        </Field>
        <Field value={answers[1]}>
          <FieldImage icon={AnimalIcon} />
          <FieldDisplay title="Animal" value={answers[1] || 'FORFEITED'} />
        </Field>
        <Field value={answers[2]}>
          <FieldImage icon={PlaceIcon} />
          <FieldDisplay title="Place" value={answers[2] || 'FORFEITED'} />
        </Field>
        <Field value={answers[3]}>
          <FieldImage icon={ThingIcon} />
          <FieldDisplay title="Thing" value={answers[3] || 'FORFEITED'} />
        </Field>
      </View>
    </View>
  );
};

const PlayerCard = ({ username }: { username: string }) => {
  const { totalScore, player } = useGameStore();

  const answers = useMemo(() => {
    return Object.values(player.answers);
  }, [player]);

  return (
    <View style={styles.container}>
      <View style={styles.playerInfo}>
        <Avatar avatarObject={avatarObject} />
        <View style={{ paddingLeft: 10, gap: 5 }}>
          <Text>{username}</Text>
          <Text>Points {totalScore}</Text>
        </View>
      </View>
      <View style={{ gap: 20 }}>
        <Field value={answers[0]}>
          <FieldImage icon={NameIcon} />
          <FieldDisplay title="Name" value={answers[0]} />
        </Field>
        <Field value={answers[1]}>
          <FieldImage icon={AnimalIcon} />
          <FieldDisplay title="Animal" value={answers[1]} />
        </Field>
        <Field value={answers[2]}>
          <FieldImage icon={PlaceIcon} />
          <FieldDisplay title="Place" value={answers[2]} />
        </Field>
        <Field value={answers[3]}>
          <FieldImage icon={ThingIcon} />
          <FieldDisplay title="Thing" value={answers[3]} />
        </Field>
      </View>
    </View>
  );
};

export default PlayerCard;

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
