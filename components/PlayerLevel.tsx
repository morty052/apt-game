import { Canvas, Circle, Group, Path } from '@shopify/react-native-skia';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './ui/Text';
import { useEffect, useState } from 'react';
import Avatar from './Avatar';

const getDistanceFromLastLevel = (total_score: number) => {
  return total_score % 100;
};

const ProgressBar = ({ distanceFromLastLevel }: { distanceFromLastLevel: any }) => {
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
      }}>
      <View
        style={{
          backgroundColor: '#00daff',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          height: 26,
          width: `${distanceFromLastLevel}%`,
          justifyContent: 'center',
        }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>100</Text>
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
  const [progress, setProgress] = useState(0);

  return (
    <Pressable style={styles.container} onPress={() => getDistanceFromLastLevel(total_score)}>
      <View
        style={{
          height: 65,
          width: 65,
          borderRadius: 75,
          zIndex: 1,
          backgroundColor: 'white',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
      </View>
      <ProgressBar distanceFromLastLevel={`${getDistanceFromLastLevel(total_score)}`} />
    </Pressable>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     width,
//     zIndex: 1,
//     borderColor: 'white',
//     borderWidth: 1,
//     paddingVertical: 5,
//     paddingRight: 20,
//     borderTopLeftRadius: 20,
//     borderBottomLeftRadius: 20,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 0.6,
    alignItems: 'center',
    maxWidth: 350,
  },
});
