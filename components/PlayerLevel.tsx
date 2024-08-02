import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

import Avatar from './Avatar';
import { Text } from './ui/Text';

const getDistanceFromLastLevel = (total_score: number) => {
  return total_score % 100;
};

export const ProgressBar = ({
  distanceFromLastLevel,
  level,
}: {
  distanceFromLastLevel: any;
  level: number;
}) => {
  return (
    <View
      style={{
        backgroundColor: 'gray',
        flex: 1,
        marginLeft: -6,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        height: 30,
        position: 'relative',
      }}>
      <View
        style={{
          backgroundColor: '#00daff',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          height: 26,
          width: `${distanceFromLastLevel}%`,
          justifyContent: 'center',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          zIndex: 1,
        }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>{level}</Text>
      </View>
    </View>
  );
};

export default function PlayerLevel({
  level,
  total_score,
}: {
  level: number;
  total_score: number;
}) {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar
          avatarObject={{
            BodyColor: 1,
            BodySize: 0,
            BodyEyes: 0,
            BodyHair: 0,
            BodyFaceHair: 0,
            BackgroundColor: 0,
          }}
        />
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            zIndex: 4,
          }}
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
      <ProgressBar
        level={level}
        distanceFromLastLevel={`${getDistanceFromLastLevel(total_score)}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 0.6,
    alignItems: 'center',
    maxWidth: 350,
  },
  avatarContainer: {
    height: 65,
    width: 65,
    borderRadius: 75,
    zIndex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
