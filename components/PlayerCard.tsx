import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './ui/Text';
import { useGameStore } from 'models/gameStore';
import Avatar from './Avatar';

const avatarObject = {
  BodyColor: 1,
  BodySize: 1,
  BodyEyes: 2,
  BodyHair: 1,
  BodyFaceHair: 2,
  BackgroundColor: 0,
};

const PlayerCard = ({
  username,
  onPress,
  inTallyMode,
}: {
  username: string;
  onPress: () => void;
  inTallyMode: boolean;
}) => {
  const { totalScore } = useGameStore();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar avatarObject={avatarObject} />
        <View style={{ paddingLeft: 10, gap: 5 }}>
          <Text>{username}</Text>
          <Text>{totalScore}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PlayerCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: 80,
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
});
