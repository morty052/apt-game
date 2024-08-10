import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Text } from './ui/Text';

export const getDistanceFromLastLevel = (total_score: number) => {
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
    <View style={{ borderWidth: 2, borderRadius: 20, borderColor: 'white', height: 42 }}>
      <View
        style={{
          backgroundColor: Colors.lightBlack,
          borderRadius: 20,
          height: 40,
          position: 'relative',
        }}>
        <LinearGradient
          colors={['steelblue', '#00daff', Colors.backGround]}
          start={{ x: 0, y: 0 }}
          style={{
            borderRadius: 20,
            height: 40,
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
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>level {level}</Text>
        </View>
      </View>
    </View>
  );
};
