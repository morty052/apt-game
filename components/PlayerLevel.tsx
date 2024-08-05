import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

import Avatar, { PlayerAvatar } from './Avatar';
import { Text } from './ui/Text';
import { useMemo } from 'react';

const getDistanceFromLastLevel = (total_score: number) => {
  return `${Math.floor((total_score % 1000) * 0.1)}%`;
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
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          height: 26,
          width: distanceFromLastLevel,
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

export default function PlayerLevel({ total_score }: { total_score: number }) {
  const navigation = useNavigation<any>();
  const distanceFromLastLevel = getDistanceFromLastLevel(total_score);
  const level = useMemo(() => Math.floor(total_score / 1000), [total_score]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <PlayerAvatar />
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
        <ProgressBar level={level} distanceFromLastLevel={distanceFromLastLevel} />
        {/* <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 50,
            backgroundColor: 'white',
            right: 50,
            borderBottomRightRadius: 20,
            zIndex: -1,
            marginLeft: -10,
          }}>
          <Text>fff</Text>
        </View> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 0.6,
    alignItems: 'center',
    maxWidth: 350,
    position: 'relative',
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
