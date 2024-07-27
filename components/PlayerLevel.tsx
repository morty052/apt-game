import { Canvas, Circle, Group, Path } from '@shopify/react-native-skia';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './ui/Text';
import { useEffect, useState } from 'react';
import Avatar from './Avatar';

const getDistanceFromLastLevel = (total_score: number) => {
  return total_score % 100;
};

const width = 80;
// export default function PlayerLevel({
//   level,
//   total_score,
// }: {
//   level: number;
//   total_score: number;
// }) {
//   const [progress, setProgress] = useState(0);
//   const r = width / 2;

//   useEffect(() => {
//     const distanceFromLastLevel = getDistanceFromLastLevel(total_score);
//     setProgress(distanceFromLastLevel);
//   }, []);

//   const path = `M ${r}, ${r} m 0, -${r} a ${r}, ${r} 0 1,1 0,${2 * r} a ${r}, ${r} 0 1,1 0,${-2 * r} Z`;
//   return (
//     <Pressable style={styles.container} onPress={() => getDistanceFromLastLevel(total_score)}>
//       <View
//         style={{
//           width,
//           height: 90,
//           position: 'relative',
//         }}>
//         <Canvas
//           style={{
//             width: 100,
//             height: 90,
//           }}>
//           <Group transform={[{ translateX: 6 }, { translateY: 5 }]}>
//             <Circle cx={r} cy={r} r={r} color="gold" />
//             <Path
//               path={path}
//               color="#d3d3d3"
//               //   strokeJoin="round"
//               strokeWidth={10}
//               // We trim the first and last quarter of the path
//               style="stroke"
//               start={0}
//               end={1}
//             />
//             <Path
//               path={path}
//               color="#00c4ee"
//               strokeJoin="round"
//               strokeCap={'round'}
//               strokeWidth={6}
//               // We trim the first and last quarter of the path
//               style="stroke"
//               start={0}
//               end={progress / 100}
//             />
//           </Group>
//         </Canvas>
//         <View
//           style={{
//             position: 'absolute',
//             top: r - 5,
//             left: 0,
//             backgroundColor: 'transparent',
//             width: 100,
//             alignItems: 'center',
//             transform: [{ translateX: -6 }],
//           }}>
//           <Text style={{ color: 'white', textAlign: 'center' }}>{level}</Text>
//         </View>
//       </View>
//     </Pressable>
//   );
// }

const ProgressBar = ({ distanceFromLastLevel }: { distanceFromLastLevel: any }) => {
  return (
    <View
      style={{
        backgroundColor: 'gray',
        flex: 1,
        marginLeft: -6,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 1,
        height: 30,
      }}>
      <View
        style={{
          backgroundColor: '#00eb00',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          height: 28,
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
